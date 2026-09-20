import os
from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI

app = FastAPI(title="AI Assistant Command Center API", version="0.2.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

MODEL = os.getenv("OPENAI_MODEL", "gpt-5.6-luna")

class CommandRequest(BaseModel):
    command: str
    language: str | None = None

class CommandResponse(BaseModel):
    message: str
    action: str
    task: dict[str, Any] | None = None
    review: dict[str, Any] | None = None
    ai_core: dict[str, Any]

def make_id(prefix: str) -> str:
    return f"{prefix}-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S%f')}"

def fallback(command: str) -> CommandResponse:
    return CommandResponse(
        message="AI Core کو AI provider تک رسائی نہیں ملی۔ Backend/local routing فعال ہے۔",
        action="none",
        ai_core={"status":"local","mode":"fallback","languages":["Urdu","Sindhi","English"]}
    )

def llm_route(command: str, language: str | None) -> CommandResponse:
    client = OpenAI()
    instructions = """You are the AI Core of a command center. Understand Urdu, Sindhi and English.
Return ONLY valid JSON matching this schema:
{
  "message": "short response in the user's language",
  "action": "none|status|task|review|website|memory|media|automation",
  "title": "task/content title or empty string",
  "needs_review": true or false
}
Do not publish anything. Critical external actions must remain behind Review Center and human approval.
Interpret the user's intent, not just keywords."""
    response = client.responses.create(
        model=MODEL,
        instructions=instructions,
        input=f"Language hint: {language or 'auto'}\nUser command: {command}",
        text={"format":{
            "type":"json_schema",
            "name":"ai_core_route",
            "strict":True,
            "schema":{
                "type":"object",
                "properties":{
                    "message":{"type":"string"},
                    "action":{"type":"string","enum":["none","status","task","review","website","memory","media","automation"]},
                    "title":{"type":"string"},
                    "needs_review":{"type":"boolean"}
                },
                "required":["message","action","title","needs_review"],
                "additionalProperties":False
            }
        }}
    )
    import json
    data=json.loads(response.output_text)
    core={"status":"online","mode":"llm","model":MODEL,"languages":["Urdu","Sindhi","English"],"timestamp":datetime.now(timezone.utc).isoformat()}
    task=None
    review=None
    if data["action"]=="task":
        task={"id":make_id("TASK"),"title":data["title"] or command,"status":"Pending","createdAt":datetime.now().astimezone().isoformat()}
    if data["action"] in ["review","media"] or data["needs_review"]:
        review={"id":make_id("CONTENT"),"title":data["title"] or command,"status":"Awaiting Review","createdAt":datetime.now().astimezone().isoformat()}
    return CommandResponse(message=data["message"],action=data["action"],task=task,review=review,ai_core=core)

@app.get("/api/health")
def health():
    return {"status":"ok","service":"AI Core","version":"0.2.0","llm_configured":bool(os.getenv("OPENAI_API_KEY")),"model":MODEL}

@app.post("/api/command", response_model=CommandResponse)
def command(request: CommandRequest):
    if not os.getenv("OPENAI_API_KEY"):
        return fallback(request.command)
    try:
        return llm_route(request.command, request.language)
    except Exception:
        return fallback(request.command)
