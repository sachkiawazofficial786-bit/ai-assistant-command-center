import os
from datetime import datetime, timezone
from typing import Any
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="AI Assistant Command Center API", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

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

def route_command(command: str) -> CommandResponse:
    text = command.strip().lower()
    core = {"status":"online","mode":"orchestrator","languages":["Urdu","Sindhi","English"],"timestamp":datetime.now(timezone.utc).isoformat()}
    if not text:
        return CommandResponse(message="براہِ کرم کوئی command لکھیں۔", action="none", ai_core=core)
    if any(x in text for x in ["status","حالت","اسٹیٹس","سسٹم"]):
        return CommandResponse(message="AI Core آن لائن ہے اور command orchestration فعال ہے۔", action="status", ai_core=core)
    if any(x in text for x in ["review","ریویو","جائزہ"]):
        return CommandResponse(message="Review Center کے لیے workflow تیار ہے۔", action="review", ai_core=core)
    if any(x in text for x in ["website","ویب سائٹ","ویب"]):
        return CommandResponse(message="Website Engine کے لیے command AI Core تک پہنچ گئی ہے۔", action="website", ai_core=core)
    if any(x in text for x in ["media","video","ویڈیو","content","مواد"]):
        return CommandResponse(message="Media command سمجھ لی گئی۔ Content کو Review Center سے گزرنا ہوگا.", action="review", review={"id":make_id("CONTENT"),"title":command,"status":"Awaiting Review","createdAt":datetime.now().astimezone().isoformat()}, ai_core=core)
    if any(x in text for x in ["task","کام","ٹاسک","نیا"]):
        return CommandResponse(message="AI Core نے command کو Task Engine کی طرف route کیا اور task تیار کر دیا۔", action="task", task={"id":make_id("TASK"),"title":command,"status":"Pending","createdAt":datetime.now().astimezone().isoformat()}, ai_core=core)
    if any(x in text for x in ["memory","میموری","یاد"]):
        return CommandResponse(message="Memory workspace منتخب کیا گیا ہے۔", action="memory", ai_core=core)
    return CommandResponse(message="AI Core نے command وصول کر لی۔ موجودہ backend orchestration نے اسے محفوظ default route پر رکھا ہے۔", action="none", ai_core=core)

@app.get("/api/health")
def health():
    return {"status":"ok","service":"AI Core","version":"0.1.0"}

@app.post("/api/command", response_model=CommandResponse)
def command(request: CommandRequest):
    return route_command(request.command)
