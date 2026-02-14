from fastapi import FastAPI, HTTPException, UploadFile, File, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import shutil
import uuid
import os
from dotenv import load_dotenv
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from models import Bot, User, Message, Conversation
import logging

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Nimmi AI Backend")

from payments import router as payments_router
import stripe
logger.info(f"Stripe Library Version: {stripe.__version__}")
app.include_router(payments_router)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    origin = request.headers.get("origin")
    logger.info(f"Incoming request: {request.method} {request.url} | Origin: {origin}")
    response = await call_next(request)
    return response

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Files
os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.on_event("startup")
async def on_startup():
    from database import init_db
    try:
        await init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Warning: Database initialization failed: {e}")
        # The app will still run, allowing the frontend to connect and see errors

# Models
class BotCreate(BaseModel):
    user_id: str # Temporary until real auth session
    bot_name: str
    system_prompt: Optional[str] = "You are a helpful assistant."
    visual_config: Optional[dict] = {"color": "#3b82f6", "logo_url": "", "position": "right"}

class ChatMessage(BaseModel):
    bot_id: str
    message: str
    visitor_session_id: str
    history: List[dict] = []

class VariableCapture(BaseModel):
    bot_id: str
    visitor_session_id: str
    variable_name: str
    variable_value: str

# Auth Models
class UserSignup(BaseModel):
    email: str
    name: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None

# Password hashing
import bcrypt as bcrypt_lib

def hash_password(password: str) -> str:
    return bcrypt_lib.hashpw(password.encode('utf-8'), bcrypt_lib.gensalt()).decode('utf-8')

def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt_lib.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))

@app.get("/")
async def root():
    return {"message": "Nimmi AI API is running with PostgreSQL"}

# Auth Endpoints
@app.post("/api/auth/signup")
async def signup(user_data: UserSignup, db: AsyncSession = Depends(get_db)):
    # Check if user exists
    result = await db.execute(select(User).where(User.email == user_data.email))
    user = result.scalars().first()
    if user:
        raise HTTPException(status_code=400, detail="User with this email already exists")
    
    # Create new user with hashed password
    new_user = User(
        email=user_data.email,
        name=user_data.name,
        password_hash=hash_password(user_data.password)
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return {"message": "Signup successful", "user_id": str(new_user.id), "name": new_user.name}

@app.post("/api/auth/login")
async def login(user_data: UserLogin, db: AsyncSession = Depends(get_db)):
    # Find user by email
    result = await db.execute(select(User).where(User.email == user_data.email))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Check if user has a password (old users might not)
    if not user.password_hash:
        raise HTTPException(status_code=401, detail="Please sign up again to set a password")
    
    # Verify password
    if not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {"message": "Login successful", "user_id": str(user.id), "name": user.name or ""}

@app.get("/api/auth/profile")
async def get_profile(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "user_id": str(user.id),
        "email": user.email,
        "name": user.name or "",
        "subscription_tier": user.subscription_tier,
        "created_at": user.created_at.isoformat() if user.created_at else None
    }

@app.patch("/api/auth/profile")
async def update_profile(user_id: str, profile_data: ProfileUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if profile_data.name is not None:
        user.name = profile_data.name
    if profile_data.email is not None:
        # Check if email is taken by another user
        existing = await db.execute(select(User).where(User.email == profile_data.email, User.id != user_id))
        if existing.scalars().first():
            raise HTTPException(status_code=400, detail="Email already in use")
        user.email = profile_data.email
    
    await db.commit()
    return {"message": "Profile updated successfully"}

@app.post("/api/bots/create")
async def create_bot(bot_data: BotCreate, db: AsyncSession = Depends(get_db)):
    new_bot = Bot(
        user_id=bot_data.user_id,
        bot_name=bot_data.bot_name,
        system_prompt=bot_data.system_prompt,
        visual_config=bot_data.visual_config
    )
    db.add(new_bot)
    await db.commit()
    await db.refresh(new_bot)
    return {"message": "Bot created", "bot_id": str(new_bot.bot_id)}

@app.get("/api/bots")
async def list_bots(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Bot).where(Bot.user_id == user_id))
    bots = result.scalars().all()
    return [
        {
            "id": str(bot.bot_id),
            "name": bot.bot_name,
            "status": "Active" if bot.is_active else "Inactive",
            "conversations": 0, # Placeholder
            "lastActive": "Just now"
        }
        for bot in bots
    ]

@app.get("/api/bots/{bot_id}/config")
async def get_bot_config(bot_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Bot).where(Bot.bot_id == bot_id))
    bot = result.scalars().first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    return {
        "bot_id": str(bot.bot_id),
        "bot_name": bot.bot_name,
        "system_prompt": bot.system_prompt,
        "visual_config": bot.visual_config,
        "flow_data": bot.flow_data,
        "knowledge_base": bot.knowledge_base,
        "is_active": bot.is_active,
        "export_unlocked": bot.export_unlocked,
        "created_at": bot.created_at
    }

@app.patch("/api/bots/{bot_id}")
async def update_bot(bot_id: str, bot_data: dict, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Bot).where(Bot.bot_id == bot_id))
    bot = result.scalars().first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    if "bot_name" in bot_data:
        bot.bot_name = bot_data["bot_name"]
    if "system_prompt" in bot_data:
        bot.system_prompt = bot_data["system_prompt"]
    if "visual_config" in bot_data:
        bot.visual_config = bot_data["visual_config"]
    if "flow_data" in bot_data:
        bot.flow_data = bot_data["flow_data"]
    if "knowledge_base" in bot_data:
        bot.knowledge_base = bot_data["knowledge_base"]
    
    await db.commit()
    return {"message": "Bot updated"}

from utils import extract_text_from_pdf, extract_text_from_txt, generate_ai_response

@app.post("/api/bots/{bot_id}/logo")
async def upload_logo(bot_id: str, file: UploadFile = File(...)):
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join("static/uploads", unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return the URL for the logo
    logo_url = f"{os.getenv('BACKEND_URL', 'http://localhost:8000')}/static/uploads/{unique_filename}"
    return {"logo_url": logo_url}

@app.post("/api/bots/{bot_id}/knowledge/upload")
async def upload_knowledge(bot_id: str, file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Bot).where(Bot.bot_id == bot_id))
    bot = result.scalars().first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    extracted_text = ""
    if file.filename.endswith(".pdf"):
        extracted_text = extract_text_from_pdf(file.file)
    elif file.filename.endswith(".txt"):
        extracted_text = extract_text_from_txt(file.file)
    else:
        raise HTTPException(status_code=400, detail="Only PDF and TXT files are supported")
    
    if not extracted_text:
        raise HTTPException(status_code=400, detail="Could not extract text from file")
    
    # Append to existing knowledge base
    if bot.knowledge_base:
        bot.knowledge_base += "\n\n" + extracted_text
    else:
        bot.knowledge_base = extracted_text
    
    await db.commit()
    return {"message": "Knowledge updated", "bot_id": bot_id, "filename": file.filename, "knowledge_base": bot.knowledge_base}

@app.post("/api/chat/message")
async def chat_message(chat: ChatMessage, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Bot).where(Bot.bot_id == chat.bot_id))
    bot = result.scalars().first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    system_prompt = bot.system_prompt or "You are a helpful assistant."
    knowledge_context = bot.knowledge_base or ""
    
    logger.info(f"Generating AI response for Bot: {bot.bot_id}")
    logger.info(f"Query: {chat.message}")
    logger.info(f"Context Length: {len(knowledge_context)} characters")
    
    try:
        answer = generate_ai_response(system_prompt, knowledge_context, chat.message)
        return {
            "answer": answer,
            "bot_id": chat.bot_id
        }
    except Exception as e:
        logger.error(f"AI Response Error: {e}")
        return {
            "answer": "Sorry, I'm having trouble thinking right now. Please try again.",
            "bot_id": chat.bot_id
        }

@app.post("/api/chat/variables")
async def capture_variables(data: VariableCapture, db: AsyncSession = Depends(get_db)):
    logger.info(f"Capturing variable: {data.variable_name} = {data.variable_value} for bot: {data.bot_id} | Session: {data.visitor_session_id}")
    # Find or create conversation
    result = await db.execute(
        select(Conversation).where(
            Conversation.bot_id == uuid.UUID(data.bot_id),
            Conversation.visitor_session_id == data.visitor_session_id
        )
    )
    conv = result.scalars().first()
    
    if not conv:
        conv = Conversation(
            bot_id=uuid.UUID(data.bot_id),
            visitor_session_id=data.visitor_session_id,
            captured_data={}
        )
        db.add(conv)
        await db.commit()
        await db.refresh(conv)
    
    # Update captured data
    captured = dict(conv.captured_data or {})
    captured[data.variable_name] = data.variable_value
    conv.captured_data = captured
    
    db.add(conv)
    await db.commit()
    return {"status": "success", "captured": captured}

@app.get("/api/bots/{bot_id}/leads")
async def get_bot_leads(bot_id: str, db: AsyncSession = Depends(get_db)):
    logger.info(f"Fetching leads for bot: {bot_id}")
    try:
        bot_uuid = uuid.UUID(bot_id)
        result = await db.execute(
            select(Conversation).where(
                Conversation.bot_id == bot_uuid
            ).order_by(Conversation.created_at.desc())
        )
        conversations = result.scalars().all()
        
        # Filter conversations that have captured data manually to avoid DB comparison issues
        leads = [
            {
                "id": str(conv.conversation_id),
                "session_id": conv.visitor_session_id,
                "data": conv.captured_data,
                "created_at": conv.created_at
            }
            for conv in conversations if conv.captured_data and len(conv.captured_data) > 0
        ]
        
        logger.info(f"Found {len(leads)} leads for bot {bot_id}")
        return leads
    except Exception as e:
        logger.error(f"Error fetching leads: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
