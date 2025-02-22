from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
from .grammar_analysis import analyze_sentence
from .text_to_speech import synthesize_speech
from .voice_processing import process_voice_input
import random

router = APIRouter()

# ✅ Define request structure for AI Voice Chat
class VoiceChatRequest(BaseModel):
    text: str
    voice: str  # e.g., "female-child" or "male-adult"

@router.post("/voice-chat/")
async def voice_chat(data: VoiceChatRequest):
    """
    Processes user speech, provides AI feedback, and generates a response.
    """
    try:
        # ✅ Analyze and correct user's input
        corrected_text = analyze_sentence(data.text)

        # ✅ AI dynamic responses to keep conversation engaging
        ai_responses = [
            "That's great! Can you tell me more?",
            "You're doing really well! Keep going!",
            "I love hearing your thoughts. What else?",
            "You're improving! Keep practicing!",
            "That sounds really interesting! What else?",
            "Wow! Can you give me more details?"
        ]
        ai_response = random.choice(ai_responses)

        return {
            "ai_response": ai_response,
            "corrected_text": corrected_text["corrected"],  # ✅ Ensure correct format
            "score": corrected_text["score"]  # ✅ Include score for feedback
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {e}")


# ✅ Text-to-Speech API (Converts AI response into speech)
@router.get("/text-to-speech/")
async def text_to_speech(
    text: str, gender: str = Query("female"), age: str = Query("child")
):
    """
    Converts AI-generated text to speech using Fish Audio API.
    """
    try:
        audio_url = synthesize_speech(text, gender, age)
        return {"audio_url": audio_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS Error: {e}")


# ✅ Define structure for processing user voice input
class VoiceInput(BaseModel):
    text: str  # User's speech converted to text
    voice: str  # Selected voice type (e.g., "female-child", "male-adult")

@router.post("/process-voice/")
async def process_voice(request: VoiceInput):
    """
    Processes the user's voice input and returns an AI-generated response.
    """
    try:
        # ✅ Process user voice input with AI
        ai_response, audio_url = process_voice_input(request.text, request.voice)

        return {
            "reply": ai_response,
            "audio_url": audio_url,  # ✅ Return AI-generated speech
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Voice processing error: {e}")
