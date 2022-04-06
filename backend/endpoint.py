from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from services.signup_login_service import signup_service, login_service

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://47dd-2601-806-4280-70e0-30ee-c6a7-6c3f-835d.ngrok.io"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class register_login(BaseModel):
    email: str
    password: str


@app.post("/authentication/register", status_code=200)
async def register(req: register_login):
    if signup_service(email=req.email, password=req.password) == 1:
        return {"status": "Registration successful", "signup_status_flag": 1}
    else:
        return {"status": "Registration unsuccessful! Username may already exist", "signup_status_flag": 0}


@app.post("/authentication/login", status_code=200)
async def login(req: register_login):
    if login_service(req.email, req.password) == 1:
        return {"status": "Login Successful", "login_status_flag": 1}
    elif login_service(req.email, req.password) == -1:
        return {"status": "Invalid password!", "login_status_flag": -1}
    else:
        return {"status": "Email does not exist!", "login_status_flag": 0}
