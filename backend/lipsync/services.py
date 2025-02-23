import requests
import os

# ✅ Load API key securely from environment variables
SYNC_API_KEY = os.getenv("SYNC_API_KEY")
SYNC_API_URL = "https://api.sync.so/v2"

def generate_lipsync(character: str, text: str):
    """Sends a request to the Sync.so API to generate a lipsync video."""
    url = f"{SYNC_API_URL}/generate"

    # ✅ Correct file format requirements
    video_url = f"https://your-storage.com/lipsyncs/sync_{character}.mp4"
    
    # ✅ Convert user text to speech (TTS)
    tts_url = f"https://api.your-tts-service.com/generate?text={text}"  # ✅ Replace with actual TTS API

    payload = {
        "model": "lipsync-1.9.0-beta",
        "input": [
            {"type": "video", "url": video_url},  # ✅ Must be MP4
            {"type": "audio", "url": tts_url}   # ✅ Must be WAV or MP3
        ],
        "options": {"output_format": "mp4"}
    }

    headers = {
        "x-api-key": SYNC_API_KEY,  # ✅ Secure API Key
        "Content-Type": "application/json"
    }

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code != 200:
        raise Exception(f"Sync.so API error: {response.status_code} {response.text}")

    return response.json()  # ✅ Returns the API response with `request_id`

def check_lipsync_status(job_id: str):
    """Checks the status of a lipsync generation job."""
    url = f"{SYNC_API_URL}/status/{job_id}"  # ✅ FIXED ENDPOINT
    headers = {"x-api-key": SYNC_API_KEY}

    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        raise Exception(f"Sync.so API error: {response.status_code} {response.text}")

    return response.json()  # ✅ Returns status & output URL
