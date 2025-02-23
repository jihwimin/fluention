import os
import requests
import time
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

# ✅ Load API Key from environment variables
load_dotenv()
SYNC_API_KEY = os.getenv("SYNC_API_KEY")
if not SYNC_API_KEY:
    raise ValueError("Missing SYNC_API_KEY! Ensure it's set in the .env file.")

router = APIRouter()

# ✅ Define Request Body
class LipsyncRequest(BaseModel):
    character: str
    text: str


# ✅ Generate Lipsync Video
@router.post("/lipsync/generate")
async def generate_lipsync(data: LipsyncRequest):
    """
    Sends a request to Sync.so API to generate a lipsynced video.
    """
    try:
        # ✅ Construct Input URLs (Ensure your MP4s are publicly accessible)
        character_video_url = f"https://yourserver.com/lipsyncs/sync_{data.character}.mp4"
        tts_audio_url = f"https://yourserver.com/tts?text={data.text}"

        # ✅ API Request Payload
        payload = {
            "model": "lipsync-1.9.0-beta",
            "input": [
                {"type": "video", "url": character_video_url},
                {"type": "audio", "url": tts_audio_url}
            ],
            "options": {"output_format": "mp4"}
        }
        headers = {"x-api-key": SYNC_API_KEY, "Content-Type": "application/json"}

        # ✅ Send Request to Sync.so API
        response = requests.post("https://api.sync.so/v2/generate", json=payload, headers=headers)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Error generating lipsync")

        response_data = response.json()
        request_id = response_data.get("request_id")
        if not request_id:
            raise HTTPException(status_code=500, detail="Failed to retrieve request ID")

        return {"request_id": request_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lipsync generation error: {e}")


# ✅ Check Lipsync Processing Status
@router.get("/lipsync/status/{request_id}")
async def get_lipsync_status(request_id: str):
    """
    Checks the status of the generated lipsync video.
    """
    try:
        url = f"https://api.sync.so/v2/status/{request_id}"
        headers = {"x-api-key": SYNC_API_KEY}

        while True:
            response = requests.get(url, headers=headers)
            data = response.json()

            if data.get("status") == "completed":
                return {"status": "completed", "video_url": data.get("output_url")}

            elif data.get("status") == "failed":
                return {"status": "failed"}

            time.sleep(5)  # ✅ Check status every 5 seconds

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to check lipsync status: {e}")
