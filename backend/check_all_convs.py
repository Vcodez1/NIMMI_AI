import asyncio
import os
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

async def check_all_conversations():
    engine = create_async_engine(DATABASE_URL)
    async with engine.begin() as conn:
        print("Checking all conversations...")
        result = await conn.execute(
            text("SELECT conversation_id, bot_id, visitor_session_id, captured_data, created_at FROM conversations")
        )
        rows = result.fetchall()
        print(f"Found {len(rows)} total conversations.")
        for row in rows:
            print(f"ID: {row[0]}, Bot: {row[1]}, Session: {row[2]}, Data: {row[3]}, Created: {row[4]}")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(check_all_conversations())
