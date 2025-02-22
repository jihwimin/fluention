from fastapi import FastAPI, File, UploadFile
import openai
import shutil
import os
from dotenv import load_dotenv  


load_dotenv()


openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload-audio/")
async def upload_audio(file: UploadFile = File(...)):
    file_path = f"{UPLOAD_DIR}/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        with open(file_path, "rb") as audio_file:
            response = openai.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file
            )
            text_result = response.text

            if not text_result:
                return {"filename": file.filename, "text": "❌ Conversion failed! Please check the server status."}

    except Exception as e:
        return {"error": f"STT failed: {str(e)}"}

    return {"filename": file.filename, "text": text_result}
