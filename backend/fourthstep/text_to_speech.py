import os
import requests
from dotenv import load_dotenv

load_dotenv()

# Get API key from .env
FISH_AUDIO_API_KEY = os.getenv("FISH_AUDIO_API_KEY")
if not FISH_AUDIO_API_KEY:
    raise ValueError("Missing Fish Audio API key! Set FISH_AUDIO_API_KEY in .env")

# Map user selection to Fish Audio API voice presets
FISH_AUDIO_VOICE_MAP = {
    ("male", "child"): "en_US_male_child",
    ("male", "adult"): "en_US_male_adult",
    ("female", "child"): "en_US_female_child",
    ("female", "adult"): "en_US_female_adult",
}

def synthesize_speech(text, gender="female", age="child"):
    """Sends text to Fish Audio API for text-to-speech conversion and returns audio URL."""
    
    # Validate gender & age
    voice_key = (gender.lower(), age.lower())
    selected_voice = FISH_AUDIO_VOICE_MAP.get(voice_key, "en_US_female_child")  # Default: Female Child
    
    # Fish Audio API Endpoint
    url = "https://api.fish.audio/tts/generate"
    
    # API Request Payload
    payload = {
        "text": text,
        "voice": selected_voice,
        "language": "en-US"
    }
    
    headers = {
        "Authorization": f"Bearer {FISH_AUDIO_API_KEY}",
        "Content-Type": "application/json"
    }

    # Send API Request
    try:
        response = requests.post(url, json=payload, headers=headers)
        response_data = response.json()
        
        # Debugging: Print API response
        print("Fish Audio API Response:", response_data)
        
        # Extract & Return Audio URL
        return response_data.get("audio_url", None)

    except Exception as e:
        print(f"Error in Fish Audio API: {e}")
        return None
