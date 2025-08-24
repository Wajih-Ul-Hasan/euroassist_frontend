from typing import Dict, List, Optional
import json
import os
from threading import Lock


class Storage:
    """Simple file-backed JSON storage for chats.

    Designed so it can be swapped for a DB adapter later by keeping method signatures
    (list_chats, get_chat, save_message).
    """

    def __init__(self, path: str = "backend/data/chats.json") -> None:
        self.path = path
        self.lock = Lock()
        os.makedirs(os.path.dirname(self.path), exist_ok=True)
        if not os.path.exists(self.path):
            with open(self.path, "w", encoding="utf-8") as f:
                json.dump({}, f)

    def _read_all(self) -> Dict[str, List[Dict]]:
        with self.lock:
            with open(self.path, "r", encoding="utf-8") as f:
                data = json.load(f)
                # migrate old-format chats (list of messages) into new format
                migrated = {}
                for k, v in data.items():
                    if isinstance(v, list):
                        migrated[k] = {"messages": v, "meta": {}}
                    elif isinstance(v, dict) and ("messages" in v or "meta" in v):
                        # already in new format
                        migrated[k] = {"messages": v.get("messages", []), "meta": v.get("meta", {})}
                    else:
                        # unknown shape, wrap as messages
                        migrated[k] = {"messages": v if isinstance(v, list) else [], "meta": {}}
                return migrated

    def _write_all(self, data: Dict[str, List[Dict]]) -> None:
        with self.lock:
            with open(self.path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)

    def list_chats(self) -> Dict[str, Optional[str]]:
        data = self._read_all()
        # return mapping chat_id -> title (if available)
        return {cid: (data[cid].get("meta", {}).get("title") if isinstance(data[cid], dict) else None) for cid in data}

    def get_chat(self, chat_id: str) -> Optional[List[Dict]]:
        data = self._read_all()
        entry = data.get(chat_id)
        if entry is None:
            return None
        # entry is {messages: [], meta: {}}
        return entry.get("messages", [])

    def save_message(self, chat_id: str, message: Dict) -> None:
        data = self._read_all()
        if chat_id not in data:
            data[chat_id] = {"messages": [], "meta": {}}
        # ensure structure
        if isinstance(data[chat_id], dict):
            data[chat_id].setdefault("messages", []).append(message)
        else:
            data[chat_id] = {"messages": [message], "meta": {}}
        self._write_all(data)

    def set_chat_title(self, chat_id: str, title: str) -> None:
        data = self._read_all()
        if chat_id not in data:
            data[chat_id] = {"messages": [], "meta": {}}
        if isinstance(data[chat_id], dict):
            data[chat_id].setdefault("meta", {})["title"] = title
        else:
            data[chat_id] = {"messages": [], "meta": {"title": title}}
        self._write_all(data)

    def get_chat_title(self, chat_id: str) -> Optional[str]:
        data = self._read_all()
        entry = data.get(chat_id)
        if not entry:
            return None
        return entry.get("meta", {}).get("title")

    # --- meta helpers and small cache for last request to dedupe rapid duplicate calls ---
    def get_chat_meta(self, chat_id: str) -> Dict:
        data = self._read_all()
        entry = data.get(chat_id)
        if not entry:
            return {}
        return entry.get("meta", {}) or {}

    def set_chat_meta(self, chat_id: str, meta: Dict) -> None:
        data = self._read_all()
        if chat_id not in data:
            data[chat_id] = {"messages": [], "meta": {}}
        if isinstance(data[chat_id], dict):
            data[chat_id]["meta"] = meta
        else:
            data[chat_id] = {"messages": [], "meta": meta}
        self._write_all(data)

    def set_last_request(self, chat_id: str, request_hash: str, response_obj: Dict, ts: float) -> None:
        meta = self.get_chat_meta(chat_id)
        meta["_last_request"] = {"hash": request_hash, "ts": ts, "response": response_obj}
        self.set_chat_meta(chat_id, meta)

    def get_last_request(self, chat_id: str) -> Optional[Dict]:
        meta = self.get_chat_meta(chat_id)
        return meta.get("_last_request")
