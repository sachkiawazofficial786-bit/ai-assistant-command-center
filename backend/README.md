# AI Core Backend

FastAPI backend for the AI Assistant Command Center.

## Real LLM connection

The AI Core now uses the OpenAI Responses API when OPENAI_API_KEY is configured. Keep the key on the server; never put it in browser JavaScript.

## Run locally

    cd backend
    python -m venv .venv
    # Windows: .venv\\Scripts\\activate
    pip install -r requirements.txt
    # PowerShell: $env:OPENAI_API_KEY="YOUR_KEY"
    # PowerShell: $env:OPENAI_MODEL="gpt-5.6-luna"
    uvicorn main:app --reload --port 8000

API: GET /api/health and POST /api/command.

The model understands Urdu, Sindhi and English and returns a structured action. Task and Review records are created by the backend. Publishing is not automatic; external actions remain behind Review Center and human approval.

If the API key is absent or the model request fails, the backend safely falls back.
