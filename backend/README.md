# EuroAssist backend

This small Flask backend provides a clean architecture skeleton for integrating a model (Gemini) to answer queries about European public universities and persist chats locally.

Getting started

1. Create a virtual environment and install dependencies:

```powershell
python -m venv .venv; .\.venv\Scripts\Activate; pip install -r requirements.txt
```

2. Run the app:

```powershell
$env:FLASK_APP='app:create_app'; python -m flask run --host=0.0.0.0 --port=5000
```

Notes & next steps
- Replace `models/model_adapter.py` with a real Gemini client. Keep `generate(prompt)` returning JSON/dict.
- Consider adding migrations and replacing `persistence/storage.py` with a DB adapter (SQLAlchemy) for scalable storage.
- Secure API keys via environment variables and do not commit them to source.
