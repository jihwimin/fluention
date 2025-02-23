from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import random
from .text_to_speech import synthesize_speech  # Import TTS function

router = APIRouter()

# ✅ Generate dynamic words
def generate_hard_word():
    """
    Uses GPT-4 to generate a sophisticated word.
    """
    return random.choice([
        "serendipity", "ubiquitous", "ephemeral", "obfuscate",
        "quintessential", "magnanimous", "pseudonym", "soliloquy",
        "juxtaposition", "conundrum"
    ])

# ✅ API Route to Get a New Word
@router.get("/get-word/")
async def get_word():
    """
    Returns a sophisticated word for pronunciation practice.
    """
    try:
        word = generate_hard_word()
        return {"word": word}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating word: {e}")

@router.get("/text-to-speech/")
async def text_to_speech(word: str):
    """
    Streams AI-generated pronunciation audio.
    """
    try:
        print(f"[DEBUG] Streaming pronunciation for: {word}")
        return synthesize_speech(word, "male", "adult")  # Default voice
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS Streaming Error: {e}")

# ✅ Pronunciation Checking Route
class PronunciationRequest(BaseModel):
    word: str
    user_said: str

@router.post("/check-pronunciation/")
async def check_pronunciation(data: PronunciationRequest):
    """
    Compares user pronunciation with the correct word.
    """
    try:
        correct = data.word.lower() == data.user_said.lower()
        return {"correct": correct}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pronunciation check error: {e}")
