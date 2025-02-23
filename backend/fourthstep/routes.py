from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .grammar_analysis import analyze_sentence
from .text_to_speech import synthesize_speech
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
        corrected_text = analyze_sentence(data.text, "conversation")

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
            "corrected_text": corrected_text["corrected"],
            "score": corrected_text["score"]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {e}")


# ✅ Text-to-Speech API (Converts AI response into speech)
@router.get("/text-to-speech/")
async def text_to_speech(text: str, gender: str = "female", age: str = "child"):
    """
    Converts AI-generated text to speech using gTTS.
    """
    try:
        audio_url = synthesize_speech(text, gender, age)
        return {"audio_url": audio_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS Error: {e}")


# ✅ Define structure for processing user voice input
class VoiceInput(BaseModel):
    text: str  # User's speech converted to text
    gender: str  # "male" or "female"
    age: str  # "child" or "adult"

@router.post("/process-voice/")
async def process_voice(request: VoiceInput):
    """
    Processes the user's voice input and returns an AI-generated response.
    """
    try:
        # ✅ Correct sentence and generate AI feedback
        corrected_text = analyze_sentence(request.text, "general conversation")
        ai_response = f"Great job! {corrected_text['corrected']} Keep going!"

        # ✅ Generate AI speech using gTTS
        audio_url = synthesize_speech(ai_response, request.gender, request.age)

        return {
            "reply": ai_response,
            "audio_url": audio_url,
            "score": corrected_text["score"],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Voice processing error: {e}")
