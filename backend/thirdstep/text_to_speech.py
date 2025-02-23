import io
from fastapi.responses import StreamingResponse
from gtts import gTTS

def synthesize_speech(text: str, gender: str, age: str):
    """
    Streams text-to-speech (TTS) audio directly instead of saving it.
    """
    try:
        print(f"[DEBUG] Generating speech for: {text}")

        # ✅ Generate speech using gTTS
        tts = gTTS(text=text, lang="en", slow=False)

        # ✅ Save audio to memory (not disk)
        audio_buffer = io.BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)  # Rewind buffer for playback

        print("[DEBUG] Returning TTS audio stream")

        # ✅ Return audio as a streaming response (MP3 format)
        return StreamingResponse(audio_buffer, media_type="audio/mpeg")

    except Exception as e:
        print(f"[ERROR] Error in TTS synthesis: {e}")
        return None
