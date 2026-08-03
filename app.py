from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel

from services.ai_service import ask_baymax

app = FastAPI(
    title="Baymax AI Medical Assistant",
    version="1.0.0"
)

app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)

templates = Jinja2Templates(directory="templates")


class ChatRequest(BaseModel):
    message: str


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "title": "Baymax"
        }
    )


@app.get("/health")
async def health():

    return {
        "status": "online"
    }


@app.post("/chat")
async def chat(data: ChatRequest):

    try:

        print("User:", data.message)

        ai_reply = ask_baymax(data.message)

        print("AI:", ai_reply)

        return {
            "response": ai_reply
        }

    except Exception as e:

        print("CHAT ERROR:", e)

        return {
            "response": str(e)
        }