# AI Core Backend

FastAPI backend for the AI Assistant Command Center.

## Run locally

```bash
cd backend
python -m venv .venv
# Windows:
.venv\\Scripts\\activate
# macOS/Linux:
# source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API:
- GET `/api/health`
- POST `/api/command`

The frontend calls `http://localhost:8000/api/command` when available and falls back to the browser command router if the backend is offline.

This is the AI Core orchestration boundary. A real LLM provider can be added behind `route_command()` later without changing the Command Center UI.
