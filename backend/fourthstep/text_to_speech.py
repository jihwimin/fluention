import os
import time
from gtts import gTTS

# ✅ Ensure "static" folder exists for saving audio files
STATIC_AUDIO_DIR = "static"
os.makedirs(STATIC_AUDIO_DIR, exist_ok=True)

def synthesize_speech(text: str, gender: str, age: str):
    """
    Converts text to speech using gTTS and saves it as an MP3 file.
    """
    try:
        print(f"[DEBUG] Generating speech for: {text} | Gender: {gender}, Age: {age}")

        # ✅ Generate unique filename
        timestamp = int(time.time())
        filename = f"speech_{timestamp}.mp3"
        file_path = os.path.join(STATIC_AUDIO_DIR, filename)

        # ✅ Generate and save speech
        tts = gTTS(text=text, lang="en", slow=False)
        tts.save(file_path)

        print(f"[DEBUG] Saved audio file: {file_path}")

        # ✅ Verify the file exists
        if not os.path.exists(file_path):
            print("[ERROR] Audio file was not created!")
            return None

        # ✅ Return the URL to access the file
        return f"/static/{filename}"

    except Exception as e:
        print(f"[ERROR] Error in TTS synthesis: {e}")
        return None
