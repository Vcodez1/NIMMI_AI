import asyncio
import os
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

async def check_leads(bot_id):
    engine = create_async_engine(DATABASE_URL)
    async with engine.begin() as conn:
        print(f"Checking leads for bot: {bot_id}")
        result = await conn.execute(
            text("SELECT conversation_id, visitor_session_id, captured_data, created_at FROM conversations WHERE bot_id = :id"),
            {"id": bot_id}
        )
        rows = result.fetchall()
        print(f"Found {len(rows)} leads.")
        for row in rows:
            print(f"ID: {row[0]}, Session: {row[1]}, Data: {row[2]}, Created: {row[3]}")
    await engine.dispose()

if __name__ == "__main__":
    import sys
    bot_id = "d9c5ea9c-f22a-4442-bc0b-4fb9663f6d7c"
    asyncio.run(check_leads(bot_id))
