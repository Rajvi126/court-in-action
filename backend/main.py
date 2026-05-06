from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import os
import uuid
import json
from datetime import datetime

from utils.pdf_utils import extract_text_from_pdf
from utils.ai_utils import analyze_text
from utils.pdf_generator import generate_pdf


# =============================
# 📁 FILE SETUP
# =============================

DATA_DIR = "data"
UPLOAD_DIR = "uploads"

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)

USERS_FILE = os.path.join(DATA_DIR, "users.json")
HISTORY_FILE = os.path.join(DATA_DIR, "history.json")

# create files if not exist
if not os.path.exists(USERS_FILE):
    with open(USERS_FILE, "w") as f:
        json.dump([], f)

if not os.path.exists(HISTORY_FILE):
    with open(HISTORY_FILE, "w") as f:
        json.dump([], f)


# =============================
# 🔄 LOAD / SAVE HELPERS
# =============================

def load_users():
    with open(USERS_FILE, "r") as f:
        return json.load(f)


def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=4)


def load_history():
    with open(HISTORY_FILE, "r") as f:
        return json.load(f)


def save_history(history):
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=4)


# =============================
# 🚀 FASTAPI APP
# =============================

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =============================
# 🔐 AUTH MODELS
# =============================

class User(BaseModel):
    username: str
    password: str

# =============================
# 🔐 AUTH ROUTES
# =============================
@app.post("/register")
async def register(user: User):
    users = load_users()

    for u in users:
        if u["username"] == user.username:
            raise HTTPException(status_code=400, detail="User already exists")

    users.append({
        "username": user.username,
        "password": user.password
    })

    save_users(users)

    return {"message": "User registered successfully"}

@app.post("/login")
async def login(user: User):
    users = load_users()

    for u in users:
        if u["username"] == user.username and u["password"] == user.password:
            return {"message": "Login successful"}

    raise HTTPException(status_code=401, detail="Invalid credentials")

# =============================
# 🏠 HOME
# =============================

@app.get("/")
def home():
    return {"message": "Court In Action API Running 🚀"}

# =============================
# 📤 UPLOAD + PROCESS
# =============================

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

@app.post("/upload/")
async def upload_pdf(
    file: UploadFile = File(...),
    username: str = Form(...),
    category: str = Form("General")
):
    # 🔐 Validate file
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files allowed")

    contents = await file.read()

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 5MB)")

    # 📄 Save temp file
    temp_filename = f"{uuid.uuid4()}.pdf"
    temp_path = os.path.join(UPLOAD_DIR, temp_filename)

    with open(temp_path, "wb") as f:
        f.write(contents)

    try:
        extracted_text = extract_text_from_pdf(temp_path)

        if not extracted_text.strip():
            raise Exception("No readable text found in PDF")

        ai_result = analyze_text(extracted_text, category) 

    except Exception as e:
        return {
            "message": "Error occurred",
            "error": str(e)
        }

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

    # 📄 Generate report
    report_filename = f"{uuid.uuid4()}.pdf"
    report_path = os.path.join(UPLOAD_DIR, report_filename)

    generate_pdf(ai_result, report_path)

    # 💾 Save history
    history = load_history()

    history.append({
        "username": username,
        "category": category,
        "report_file": report_filename,
        "timestamp": str(datetime.now())
    })

    save_history(history)

    # 📥 Return file
    return FileResponse(
        path=report_path,
        filename="court_report.pdf",
        media_type="application/pdf"
    )

@app.get("/download/{filename}")
def download_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(
        path=file_path,
        filename="court_report.pdf",
        media_type="application/pdf"
    )

# =============================
# 📊 USER HISTORY
# =============================

@app.get("/history/{username}")
def get_history(username: str):
    history = load_history()

    user_history = [h for h in history if h["username"] == username]

    return user_history 