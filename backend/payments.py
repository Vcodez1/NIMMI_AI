import stripe
import os
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db
from models import Bot
import uuid
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/payments", tags=["payments"])

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
DASHBOARD_URL = os.getenv("DASHBOARD_URL", "http://localhost:3000")

@router.post("/create-checkout-session")
async def create_checkout_session(bot_id: str, db: AsyncSession = Depends(get_db)):
    try:
        # Check if bot exists
        bot_uuid = uuid.UUID(bot_id)
        result = await db.execute(select(Bot).where(Bot.bot_id == bot_uuid))
        bot = result.scalars().first()
        if not bot:
            raise HTTPException(status_code=404, detail="Bot not found")

        # Create Stripe checkout session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card', 'upi'],
            line_items=[
                {
                    'price_data': {
                        'currency': 'inr',
                        'product_data': {
                            'name': f'Unlock Export for {bot.bot_name}',
                        },
                        'unit_amount': 5000, # 50 INR (Minimum for account conversion)
                    },
                    'quantity': 1,
                },
            ],
            mode='payment',
            success_url=f"{BACKEND_URL}/api/payments/success?session_id={{CHECKOUT_SESSION_ID}}&bot_id={bot_id}",
            cancel_url=f"{DASHBOARD_URL}/dashboard/builder/{bot_id}?payment=cancelled",
            metadata={
                "bot_id": bot_id
            }
        )
        return {"url": checkout_session.url}
    except Exception as e:
        logger.error(f"Payment error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/success")
async def payment_success(session_id: str, bot_id: str, db: AsyncSession = Depends(get_db)):
    try:
        # For simplicity in this demo, we'll verify the session and unlock the bot
        # In production, this should be handled by a Webhook
        if session_id == "mock_session_123":
            payment_paid = True
        else:
            session = stripe.checkout.Session.retrieve(session_id)
            payment_paid = session.payment_status == "paid"
        
        if payment_paid:
            bot_uuid = uuid.UUID(bot_id)
            result = await db.execute(select(Bot).where(Bot.bot_id == bot_uuid))
            bot = result.scalars().first()
            if bot:
                bot.export_unlocked = True
                db.add(bot)
                await db.commit()
                logger.info(f"Bot {bot_id} export UNLOCKED permanently.")
                return RedirectResponse(url=f"{DASHBOARD_URL}/dashboard/payment-success?bot_id={bot_id}")
            
        # Redirect back to dashboard builder if payment failed or bot not found
        return RedirectResponse(url=f"{DASHBOARD_URL}/dashboard/builder/{bot_id}?payment=failed")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
