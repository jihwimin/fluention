from fastapi import FastAPI, File, UploadFile
import openai
import shutil
import os
from dotenv import load_dotenv  

# Load environment variables
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 🎯 GPT-4 function to normalize text
def normalize_text(text):
    prompt = f"""Convert the following transcribed speech into a properly formatted and readable sentence:
    
    Input: "{text}"
    
    Output:"""

    try:
        # Create OpenAI client
        client = openai.OpenAI()
        
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"GPT-4 processing failed: {str(e)}"


@app.post("/upload-audio/")
async def upload_audio(file: UploadFile = File(...)):
    file_path = f"{UPLOAD_DIR}/{file.filename}"

    # Save the uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Convert speech to text using OpenAI Whisper API
    try:
        # Create OpenAI client
        client = openai.OpenAI()

        with open(file_path, "rb") as audio_file:
            response = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file
            )
            text_result = response.text

            if not text_result:
                return {"filename": file.filename, "text": "❌ Conversion failed! No text detected."}

    except Exception as e:
        return {"error": f"STT failed: {str(e)}"}

    # 🆕 Normalize text using GPT-4
    normalized_text = normalize_text(text_result)

    return {
        "filename": file.filename,
        "original_text": text_result,
        "normalized_text": normalized_text
    }
