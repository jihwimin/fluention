from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from grammar_analysis import correct_sentence, score_sentence
from generate_image import generate_image
from speech_processing import transcribe_audio_google

router = APIRouter()

class SpeechInput(BaseModel):
    text: str
    scenario_prompt: str  # ✅ Includes the original scenario

@router.get("/generate-image/")
async def get_image():
    """
    Generates an AI-generated image and scenario.
    """
    image_data = generate_image()
    if not image_data:
        raise HTTPException(status_code=500, detail="Failed to generate image.")
    
    return image_data  # ✅ Returns both image_url and scenario_prompt

@router.post("/transcribe/")
async def transcribe(file: UploadFile = File(...)):
    """
    Transcribes audio and returns the text.
    """
    try:
        text = transcribe_audio_google(file.filename)
        return {"transcribed_text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process-text/")
async def process_text(request: SpeechInput):
    """
    Processes the user's speech, corrects it, and computes a score.
    """
    try:
        corrected_text = correct_sentence(request.text, request.scenario_prompt)
        score = score_sentence(request.text, corrected_text, request.scenario_prompt)

        return {
            "original": request.text,
            "corrected": corrected_text,
            "score": score
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
