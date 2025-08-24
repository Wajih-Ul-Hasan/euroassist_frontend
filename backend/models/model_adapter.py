from typing import Union, Optional
import os
import json
import logging

try:
    import google.generativeai as genai  # type: ignore
except Exception:  # pragma: no cover
    genai = None

logger = logging.getLogger(__name__)


class ModelAdapter:
    """Adapter for Google Gemini text generation with fallback to dummy data."""

    def __init__(self) -> None:
        self.model_name = os.environ.get("EUROASSIST_MODEL", "gemini-1.5-flash")
        self.api_key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")

        if genai and self.api_key:
            genai.configure(api_key=self.api_key)
            logger.info("Configured google-generativeai for model %s", self.model_name)
        elif genai and not self.api_key:
            logger.warning("google-generativeai installed but no API key found in environment.")
        else:
            logger.info("google-generativeai client not available; using dummy responses.")

    def _call_gemini(self, prompt: str) -> str:
        """Call Gemini using whichever client API is available."""
        if not genai or not self.api_key:
            raise RuntimeError("Gemini client not configured")

        # Try new API first
        try:
            if hasattr(genai, "GenerativeModel"):
                model = genai.GenerativeModel(self.model_name)
                resp = model.generate_content(prompt)
                if resp and hasattr(resp, "text") and resp.text:
                    return resp.text
                # fallback to string conversion
                return str(resp)
        except Exception as e:
            logger.debug("generate_content failed: %s", e)

        # Legacy APIs
        attempts = []
        if hasattr(genai, "generate_text"):
            attempts.append(lambda: genai.generate_text(model=self.model_name, prompt=prompt, max_output_tokens=512))
        if hasattr(genai, "text") and hasattr(genai.text, "generate"):
            attempts.append(lambda: genai.text.generate(model=self.model_name, prompt=prompt, max_output_tokens=512))
        if hasattr(genai, "generate"):
            attempts.append(lambda: genai.generate(model=self.model_name, prompt=prompt, max_output_tokens=512))

        last_exc: Optional[Exception] = None
        for fn in attempts:
            try:
                resp = fn()
                if resp is None:
                    continue
                # unified text extraction
                text = getattr(resp, "text", None)
                if text:
                    return text
                if isinstance(resp, dict):
                    for k in ("text", "content", "output", "message"):
                        if k in resp:
                            return resp[k]
                return str(resp)
            except Exception as e:
                last_exc = e
                continue

        raise RuntimeError(f"No supported Gemini generate method worked. Last error: {last_exc}")

    def generate(self, prompt: str) -> Union[str, dict]:
        """Generate output from Gemini or fallback dummy data."""
        if genai and self.api_key:
            try:
                raw = self._call_gemini(prompt)
                try:
                    return json.loads(raw)
                except Exception:
                    return raw
            except Exception as e:
                logger.exception("Gemini call failed, falling back to dummy: %s", e)

        # Dummy response matches schema
        return {
            "name": "University of Example",
            "country": "Exampleland",
            "ranking": "Top 200",
            "tuition_fee": "€1,500 per semester",
            "scholarships": ["Merit-based grant", "International student scholarship"],
            "description": "A public university with a wide range of programs and international partnerships."
        }
