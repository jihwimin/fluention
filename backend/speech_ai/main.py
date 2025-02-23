from fastapi import FastAPI, File, UploadFile, Form
import openai
import shutil
import os
import logging
from google.cloud import texttospeech
from dotenv import load_dotenv  

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables explicitly
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(env_path)

# Get OpenAI API Key from environment variables
openai_api_key = os.getenv("OPENAI_API_KEY")

if not openai_api_key:
    logger.error("❌ Error: OPENAI_API_KEY not found. Make sure the .env file is properly loaded.")
    raise ValueError("OPENAI_API_KEY not found. Check your .env file and restart the server.")

# Set Google Cloud credentials from environment variables
google_credentials = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "backend/speech_ai/google_credentials.json")
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = google_credentials

app = FastAPI()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 🎯 STT: Convert Speech to Text (Whisper API)
@app.post("/upload-audio/")
async def upload_audio(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # Save the uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Convert speech to text using OpenAI Whisper
    try:
        # Initialize OpenAI Client with API key
        client = openai.OpenAI(api_key=openai_api_key)

        with open(file_path, "rb") as audio_file:
            response = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,  # ✅ 쉼표 추가
                language="en"     # ✅ 올바른 위치로 수정
            )
            text_result = response.text

            if not text_result:
                return {"filename": file.filename, "text": "❌ No text detected."}

    except Exception as e:
        logger.error(f"STT failed: {str(e)}")
        return {"error": f"STT failed: {str(e)}"}

    # 📝 Normalize text using GPT-4
    normalized_text = normalize_text(text_result)

    return {"filename": file.filename, "original_text": text_result, "normalized_text": normalized_text}

# 🎯 최신 GPT-4 Text Normalization 함수 (오류 해결)
def normalize_text(text):
    try:
        client = openai.OpenAI(api_key=openai_api_key)  # ✅ 최신 API 사용

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": f"Normalize this transcribed speech: {text}"}]
        )
        return response.choices[0].message.content  # ✅ 응답 형식 수정
    except Exception as e:
        logger.error(f"Normalization failed: {str(e)}")
        return f"Normalization failed: {str(e)}"

# 🎯 TTS: Convert Text to Speech (Google Cloud TTS)
def text_to_speech(text):
    try:
        client = texttospeech.TextToSpeechClient()
        synthesis_input = texttospeech.SynthesisInput(text=text)
        voice = texttospeech.VoiceSelectionParams(
            language_code="en-US",
            ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
        )
        audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)

        response = client.synthesize_speech(
            input=synthesis_input,
            voice=voice,
            audio_config=audio_config
        )

        tts_file_path = os.path.join(UPLOAD_DIR, "output.mp3")
        with open(tts_file_path, "wb") as out:
            out.write(response.audio_content)

        return tts_file_path
    except Exception as e:
        logger.error(f"TTS failed: {str(e)}")
        return None

@app.post("/text-to-speech/")
async def tts_endpoint(text: str = Form(...)):
    tts_file = text_to_speech(text)
    if not tts_file:
        return {"error": "❌ TTS conversion failed. Please check server logs."}
    return {"audio_file": tts_file}
