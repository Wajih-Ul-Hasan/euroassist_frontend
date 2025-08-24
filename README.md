EuroAssist Frontend + Flask backend

Quick Vercel deployment notes

1) Frontend (Vite) deployment
- Set the Vercel project root to `frontend/`.
- Add an Environment Variable in Vercel: `VITE_API_URL` set to your backend URL (for example `https://my-backend.example.com`).
- Build Command: `npm run build` (Vite default). Output Directory: `dist`.

2) Backend deployment
- The backend is a Flask app. Vercel can run Python Serverless functions or you can deploy the backend to a separate host (Heroku, Render, Fly, Railway, GCP, etc.).
- If deploying the Flask app to another host, set `VERCEL_BACKEND_URL` in Vercel to point to the backend root (for example `https://my-backend.example.com`). The `vercel.json` redirect will proxy `/api/*` requests to that backend.

3) Environment variables for the backend
- `GOOGLE_API_KEY` (or your provider key) — set on the backend host, not in the frontend.
- `EUROASSIST_STORAGE` (optional) — path to storage JSON for the backend host.

4) Local testing
- Frontend: cd into `frontend/` and run `npm install` then `npm run dev`.
- Backend: from `backend/` create a virtualenv, install requirements (`pip install -r requirements.txt`), set environment variables, and run `python app.py`.

Optional: deploy the backend with Gunicorn (example)

- Install: `pip install gunicorn`
- Run: `gunicorn -w 4 -b 0.0.0.0:8000 backend.wsgi:app`

Set environment variables on your hosting provider (e.g., Render, Railway, Fly):
- `GOOGLE_API_KEY` — your model API key
- `EUROASSIST_STORAGE` — optional path to store chats

When deploying the frontend to Vercel, set `VITE_API_URL` (Project Settings -> Environment Variables) to the public URL of your backend (for example `https://your-backend.example.com`).
