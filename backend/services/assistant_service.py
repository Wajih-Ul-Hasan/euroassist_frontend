from typing import Any, Dict, Optional
from persistence.storage import Storage
from models.model_adapter import ModelAdapter
from jsonschema import validate, ValidationError
import json
import re
import logging
import time

logger = logging.getLogger(__name__)


university_schema = {
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "country": {"type": "string"},
        "ranking": {"type": "string"},
        "tuition_fee": {"type": "string"},
        "scholarships": {"type": "array", "items": {"type": "string"}},
        "description": {"type": "string"}
    },
    "required": [
        "name",
        "country",
        "ranking",
        "tuition_fee",
        "scholarships",
        "description"
    ]
}


PROMPT_TEMPLATE = (
    "You are EuroAssist.ai, an assistant helping students explore European public universities.\n"
    "IMPORTANT: Output only valid JSON that exactly matches the schema below, and do NOT include any surrounding text, explanation, or markdown.\n"
    "Return a single JSON object with details about a European public university if the query is relevant.\n"
    "If the query is NOT about European public universities, respond with exactly this message:\n"
    "\"Sorry I can't help you in this matter.\""
)


# Provide a concrete example the model should follow (must conform to the schema)
EXAMPLE_OUTPUT = {
    "name": "Example University",
    "country": "Exampleland",
    "ranking": "Top 200",
    "tuition_fee": "€1,200 per semester",
    "scholarships": ["Merit scholarship", "International award"],
    "description": "A public research university with strong international programs."
}


class AssistantService:
    def __init__(self, storage: Storage, model_adapter: Optional[ModelAdapter] = None) -> None:
        self.storage = storage
        self.model = model_adapter or ModelAdapter()

    def build_prompt(self, user_query: str) -> str:
        prompt = (
            PROMPT_TEMPLATE
            + json.dumps(university_schema, indent=2)
            + "\n\nExample output (follow this exactly):\n"
            + json.dumps(EXAMPLE_OUTPUT, indent=2)
            + f"\nUser Query: \"{user_query}\"\n"
        )
        return prompt

    def handle_query(self, user_query: str, chat_id: Optional[str] = None) -> Dict[str, Any]:
        prompt = self.build_prompt(user_query)
        # dedupe: if an identical request for this chat arrived very recently, return cached response
        try:
            if chat_id is None:
                cid = "default"
            else:
                cid = chat_id
            last = self.storage.get_last_request(cid)
            # create a simple stable hash from the query
            request_hash = json.dumps({"q": user_query}, sort_keys=True)
            if last:
                # allow a small TTL to avoid race double-calls from frontend
                last_ts = last.get("ts", 0)
                if last.get("hash") == request_hash and (time.time() - last_ts) < 5.0:
                    # return the cached response object (and avoid double-saving)
                    return last.get("response")
        except Exception:
            logger.exception("Error checking last request cache")
        # call model
        raw = self.model.generate(prompt)
        # expect raw to be JSON string or dict or text containing JSON
        data = None

        def extract_json_from_text(text: str) -> Optional[Dict]:
            # 1) look for ```json ... ``` blocks
            fence_match = re.search(r"```json\s*(\{[\s\S]*?\})\s*```", text, re.IGNORECASE)
            if fence_match:
                candidate = fence_match.group(1)
                try:
                    return json.loads(candidate)
                except Exception:
                    pass

            # 2) look for first balanced { ... } block
            idx = text.find('{')
            if idx != -1:
                stack = []
                start = None
                for i in range(idx, len(text)):
                    ch = text[i]
                    if ch == '{':
                        if start is None:
                            start = i
                        stack.append('{')
                    elif ch == '}':
                        if stack:
                            stack.pop()
                            if not stack and start is not None:
                                candidate = text[start:i+1]
                                try:
                                    return json.loads(candidate)
                                except Exception:
                                    # try to continue searching
                                    start = None
                                    continue

            # 3) fallback: try entire text as JSON
            try:
                return json.loads(text)
            except Exception:
                return None

        if isinstance(raw, dict):
            data = raw
        elif isinstance(raw, str):
            # try to extract JSON from text
            parsed = extract_json_from_text(raw)
            if parsed is not None:
                data = parsed
            else:
                # fallback: put raw text into description and set unknown fields
                logger.warning("Model output did not contain valid JSON; returning fallback. Raw: %s", raw[:500])
                data = {
                    "name": "",
                    "country": "",
                    "ranking": "",
                    "tuition_fee": "",
                    "scholarships": [],
                    "description": raw
                }
        else:
            raise ValueError("Unsupported model output type")

        # validate shape (this will raise jsonschema.ValidationError on failure)
        try:
            validate(instance=data, schema=university_schema)
        except ValidationError as ve:
            logger.warning("Initial model output failed schema validation: %s", ve)

            # Retry once with a stricter follow-up prompt that instructs the model to output only JSON.
            retry_prompt = (
                "The previous response was not valid JSON matching the required schema.\n"
                "Please OUTPUT ONLY valid JSON that exactly matches the schema below (no surrounding text or explanation).\n\n"
                + json.dumps(university_schema, indent=2)
                + "\n\nExample output:\n"
                + json.dumps(EXAMPLE_OUTPUT, indent=2)
                + f"\nPrevious model output:\n{raw}\n"
            )

            try:
                retry_raw = self.model.generate(retry_prompt)
                parsed_retry = None
                if isinstance(retry_raw, dict):
                    parsed_retry = retry_raw
                elif isinstance(retry_raw, str):
                    parsed_retry = extract_json_from_text(retry_raw)

                if parsed_retry is not None:
                    # try validate the retried parse
                    validate(instance=parsed_retry, schema=university_schema)
                    data = parsed_retry
                    raw = retry_raw
                else:
                    logger.warning("Retry did not return parseable JSON. Falling back to raw text.")
            except ValidationError as ve2:
                logger.warning("Retry response failed validation: %s", ve2)
            except Exception as e:
                logger.exception("Retry attempt raised an exception: %s", e)

        # persist message (use chat_id default)
        if chat_id is None:
            chat_id = "default"

        message = {"sender": "assistant", "text": data}
        self.storage.save_message(chat_id, message)

        # store last request/response to dedupe near-duplicate incoming requests
        try:
            resp_obj = {"result": data, "chat_id": chat_id, "title": self.storage.get_chat_title(chat_id)}
            request_hash = json.dumps({"q": user_query}, sort_keys=True)
            self.storage.set_last_request(chat_id, request_hash, resp_obj, time.time())
        except Exception:
            logger.exception("Failed to persist last request cache")

        # generate a short title for the chat and persist it (best-effort)
        try:
            title = self._generate_chat_title(chat_id)
            if title:
                self.storage.set_chat_title(chat_id, title)
        except Exception:
            logger.exception("Failed to generate or persist chat title")

        # return the title as part of response
        chat_title = self.storage.get_chat_title(chat_id)

        return {"result": data, "chat_id": chat_id, "title": chat_title}

    def _generate_chat_title(self, chat_id: str) -> Optional[str]:
        # fetch recent messages and ask model to summarize into a short title (<= 45 chars)
        messages = self.storage.get_chat(chat_id) or []
        if not messages:
            return None

        # build a compact conversation text
        convo = []
        for m in messages[-10:]:
            role = m.get("sender", "user")
            text = m.get("text", "")
            convo.append(f"{role}: {text}")

        summary_prompt = (
            "You are EuroAssist.ai. Given the following short conversation, produce a concise title (<=45 characters) that summarizes the user's intent or topic."
            " Output ONLY the title string, no punctuation around it.\n\n"
            + "\n".join(convo)
        )

        try:
            raw = self.model.generate(summary_prompt)
            if isinstance(raw, str):
                title = raw.strip().splitlines()[0]
            elif isinstance(raw, dict):
                # if model returned JSON, try to find a title field
                title = raw.get("title") or raw.get("summary") or str(raw)
            else:
                title = None

            if title:
                # normalize length
                t = title.strip()
                return t if len(t) <= 45 else t[:42].rstrip() + "..."
        except Exception:
            logger.exception("Error generating chat title")

        return None
