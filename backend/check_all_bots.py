import asyncio
import os
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

async def check_all_bots():
    engine = create_async_engine(DATABASE_URL)
    async with engine.begin() as conn:
        print("Checking all bots...")
        result = await conn.execute(text("SELECT bot_id, bot_name FROM bots"))
        rows = result.fetchall()
        print(f"Found {len(rows)} total bots.")
        for row in rows:
            print(f"ID: {row[0]}, Name: {row[1]}")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(check_all_bots())
