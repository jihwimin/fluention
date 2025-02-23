from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from .pronunciation_game import get_challenging_word, check_pronunciation
from .text_to_speech import synthesize_speech
from .speech_processing import transcribe_audio_google

router = APIRouter()

# ✅ Game data structure
class PronunciationAttempt(BaseModel):
    user_audio: str  # Audio file (path) of user's speech
    target_word: str  # The word user is trying to pronounce

# ✅ Step 1: Get a challenging word
@router.get("/get-word/")
async def get_word():
    """
    Returns a challenging word for the pronunciation game.
    """
    try:
        word = get_challenging_word()
        audio_url = synthesize_speech(word, "female", "adult")  # AI reads the word
        return {"word": word, "audio_url": audio_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating word: {e}")

# ✅ Step 2: Check pronunciation accuracy
@router.post("/check-pronunciation/")
async def check_pronunciation_route(file: UploadFile = File(...), target_word: str = ""):
    """
    Takes user’s speech, transcribes it, and checks if it matches the AI’s word.
    - If correct → GREEN
    - If incorrect → RED
    """
    try:
        # ✅ Convert user audio to text
        transcribed_text = transcribe_audio_google(file.file)

        # ✅ Check if pronunciation is correct
        is_correct = check_pronunciation(target_word, transcribed_text)

        return {
            "user_said": transcribed_text,
            "correct": is_correct,  # Boolean → Green (✅) or Red (❌)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pronunciation check error: {e}")
