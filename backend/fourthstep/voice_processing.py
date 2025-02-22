import os
from openai import OpenAI
from dotenv import load_dotenv
import requests

# ✅ Load environment variables
load_dotenv()

# ✅ Retrieve API keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
FISH_AUDIO_API_KEY = os.getenv("FISH_AUDIO_API_KEY")

# ✅ Validate API keys
if not OPENAI_API_KEY or not FISH_AUDIO_API_KEY:
    raise ValueError("Missing API keys! Ensure OPENAI_API_KEY and FISH_AUDIO_API_KEY are set in .env file.")

# ✅ Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

def process_voice_input(user_text: str, voice_type: str):
    """
    Processes user speech input, generates a friendly AI response, and converts it into speech.
    """
    try:
        # ✅ Step 1: Generate AI Response
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a friendly AI voice assistant for kids and neurodivergent individuals. Keep responses simple, positive, and engaging. Ask follow-up questions."},
                {"role": "user", "content": user_text}
            ],
            temperature=0.7
        )

        ai_response = response.choices[0].message.content.strip()

        # ✅ Step 2: Convert AI Response to Speech (Using Fish Audio API)
        audio_url = synthesize_speech(ai_response, voice_type)

        return ai_response, audio_url

    except Exception as e:
        print(f"Error processing voice input: {e}")
        return "Sorry, something went wrong!", None


def synthesize_speech(text: str, voice_type: str):
    """
    Converts text to speech using Fish Audio API.
    """
    try:
        # ✅ Define Fish Audio API URL
        fish_audio_url = "https://api.fishaudio.com/generate-speech"

        # ✅ Map voice selections
        voice_mapping = {
            "female-child": "en-US-Wavenet-G",
            "female-adult": "en-US-Wavenet-F",
            "male-child": "en-US-Wavenet-D",
            "male-adult": "en-US-Wavenet-B"
        }

        # ✅ Ensure valid voice type
        selected_voice = voice_mapping.get(voice_type, "en-US-Wavenet-G")  # Default to female-child

        # ✅ API Request Payload
        payload = {
            "text": text,
            "voice": selected_voice,
            "format": "mp3"
        }
        headers = {
            "Authorization": f"Bearer {FISH_AUDIO_API_KEY}",
            "Content-Type": "application/json"
        }

        # ✅ Make API Request
        response = requests.post(fish_audio_url, json=payload, headers=headers)

        # ✅ Handle Response
        if response.status_code == 200:
            return response.json().get("audio_url", None)
        else:
            print(f"Fish Audio API Error: {response.text}")
            return None

    except Exception as e:
        print(f"Error in TTS synthesis: {e}")
        return None
