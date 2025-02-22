import openai

openai.api_key = "YOUR_OPENAI_API_KEY"

def speech_to_text(audio_file):
    with open(audio_file, "rb") as f:
        transcript = openai.Audio.transcribe("whisper-1", f)
    return transcript["text"]
