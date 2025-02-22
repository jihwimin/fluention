from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
from speech_processing import transcribe_audio_google  # ✅ Fix the import
from grammar_analysis import analyze_sentence
from generate_image import generate_image
from score_analysis import calculate_score

router = APIRouter()

@router.get("/generate-image/")
async def get_image(difficulty: str = "easy"):
    image_url = generate_image(difficulty)
    return {"image_url": image_url}

@router.post("/transcribe/")
async def transcribe(file: UploadFile = File(...)):
    text = transcribe_audio_google(file.filename)  # ✅ Update function call
    corrected_text = analyze_sentence(text)
    score = calculate_score(text, corrected_text)
    
    return {"original": text, "corrected": corrected_text, "score": score}


class SpeechInput(BaseModel):
    text: str

@router.post("/process-text/")
async def process_text(data: SpeechInput):
    corrected_text = analyze_sentence(data.text)
    score = calculate_score(data.text, corrected_text)
    
    return {"original": data.text, "corrected": corrected_text, "score": score}