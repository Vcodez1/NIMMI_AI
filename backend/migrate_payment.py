import asyncio
import os
from sqlalchemy import text
from database import engine

async def migrate():
    async with engine.begin() as conn:
        print("Migrating database...")
        # Add export_unlocked to bots table
        try:
            await conn.execute(text("ALTER TABLE bots ADD COLUMN IF NOT EXISTS export_unlocked BOOLEAN DEFAULT FALSE"))
            print("Successfully added export_unlocked column to bots table.")
        except Exception as e:
            print(f"Error adding column: {e}")
            
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(migrate())
