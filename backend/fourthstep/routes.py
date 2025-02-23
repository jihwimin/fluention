from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .grammar_analysis import analyze_sentence
from .text_to_speech import synthesize_speech
from openai import OpenAI
from dotenv import load_dotenv
import os

# ✅ Load environment variables
load_dotenv()

# ✅ Retrieve OpenAI API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("OpenAI API key is missing! Set it in the .env file.")

# ✅ Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

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
    - Engages in friendly conversation.
    - Gives grammar advice **only if needed**.
    - Generates a **natural** AI response.
    - AI **response is read aloud first** via TTS.
    """
    try:
        # ✅ Step 1: Analyze Sentence for Grammar Correction
        grammar_feedback = analyze_sentence(request.text)
        corrected_text = grammar_feedback["corrected"]
        corrected_flag = grammar_feedback["corrected_flag"]
        score = grammar_feedback["score"]

        # ✅ Step 2: Generate AI Response using OpenAI
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a friendly AI friend for kids and neurodivergent individuals. Keep responses simple, positive, and engaging. Ask follow-up questions. Correct user's sentences if their sentence have grammatical issues. Punctuations do not matter. "},
                {"role": "user", "content": request.text}
            ],
            temperature=0.7
        )

        ai_response = response.choices[0].message.content.strip()

        # ✅ Step 4: Convert AI Response to Speech using gTTS
        audio_url = synthesize_speech(ai_response, request.gender, request.age)

        return {
            "reply": ai_response,  # ✅ AI's natural response
            "audio_url": audio_url,  # ✅ Playable TTS link
            "score": score,  # ✅ Encouraging score
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Voice processing error: {e}")