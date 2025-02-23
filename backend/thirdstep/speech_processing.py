import io
import os
from google.cloud import speech
from dotenv import load_dotenv

load_dotenv()

# ✅ Set Google Cloud credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "backend/google_credentials.json"

def transcribe_audio_google(audio_file):
    """
    Uses Google Speech-to-Text API to transcribe user’s pronunciation attempt.
    """
    client = speech.SpeechClient()

    content = audio_file.read()
    audio = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code="en-US",
    )

    response = client.recognize(config=config, audio=audio)

    # ✅ Return transcribed text if successful
    for result in response.results:
        return result.alternatives[0].transcript

    return "Error processing audio"
