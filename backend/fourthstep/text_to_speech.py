import os
import time
from gtts import gTTS

# Ensure the "static" folder exists to store generated audio files
STATIC_AUDIO_DIR = "static"
os.makedirs(STATIC_AUDIO_DIR, exist_ok=True)

def synthesize_speech(text: str, gender: str, age: str):
    """
    Converts text to speech using gTTS and saves it as an MP3 file.

    Args:
        text (str): The text to convert to speech.
        gender (str): "male" or "female" (not used in gTTS but can be extended).
        age (str): "child" or "adult" (not used in gTTS but can be extended).

    Returns:
        str: URL path to the generated audio file.
    """
    try:
        # ✅ Use gTTS to generate speech
        tts = gTTS(text=text, lang="en", slow=False)

        # ✅ Generate a unique filename to avoid overwriting files
        timestamp = int(time.time())
        filename = f"speech_{timestamp}.mp3"
        file_path = os.path.join(STATIC_AUDIO_DIR, filename)

        # ✅ Save the MP3 file
        tts.save(file_path)

        # ✅ Return the URL to access the file
        return f"/static/{filename}"

    except Exception as e:
        print(f"Error in TTS synthesis: {e}")
        return None
