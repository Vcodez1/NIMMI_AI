import asyncio
import os
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

async def check_bot(bot_id):
    engine = create_async_engine(DATABASE_URL)
    async with engine.begin() as conn:
        result = await conn.execute(text("SELECT bot_id, bot_name, knowledge_base FROM bots WHERE bot_id = :id"), {"id": bot_id})
        row = result.fetchone()
        if row:
            print(f"Bot found: {row[0]}")
            print(f"Name: {row[1]}")
            print(f"Knowledge Base: {row[2]}")
        else:
            print(f"Bot {bot_id} NOT found")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(check_bot("d9c5ea9c-f22a-4447-bc0b-4fb9663f6d7c"))
