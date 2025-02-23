import os
from openai import OpenAI
from dotenv import load_dotenv
import requests
from .grammar_analysis import analyze_sentence  # ✅ Import grammar analysis

# ✅ Load environment variables
load_dotenv()

# ✅ Retrieve API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# ✅ Validate API key
if not OPENAI_API_KEY:
    raise ValueError("Missing API key! Ensure OPENAI_API_KEY is set in .env file.")

# ✅ Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

def process_voice_input(user_text: str, gender: str, age: str):
    """
    Processes user speech input, generates a friendly AI response, and converts it into speech.
    - AI gives grammar advice **only if needed**.
    - AI responses are **simple, positive, and engaging**.
    - Uses **gTTS** to generate speech.
    """
    try:
        # ✅ Step 1: Analyze Sentence for Grammar Correction
        grammar_feedback = analyze_sentence(user_text)  # ✅ FIXED: Removed extra parameter

        corrected_text = grammar_feedback["corrected"]
        corrected_flag = grammar_feedback["corrected_flag"]
        score = grammar_feedback["score"]
        
        # ✅ If the sentence is **already correct**, **skip correction message**
        grammar_suggestion = f" By the way, here's a better way to say it: '{corrected_text}'." if corrected_flag else ""

        # ✅ Step 2: Generate AI Response (simple, engaging, & positive)
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a friendly AI voice assistant for kids and neurodivergent individuals. Keep responses simple, positive, and engaging. Ask follow-up questions."},
                {"role": "user", "content": user_text}
            ],
            temperature=0.7
        )

        ai_response = response.choices[0].message.content.strip()

        # ✅ Step 3: Combine AI response + grammar advice (if needed)
        final_response = ai_response + grammar_suggestion

        # ✅ Step 4: Convert AI Response to Speech using gTTS
        audio_url = synthesize_speech(final_response, gender, age)

        return final_response, audio_url, score

    except Exception as e:
        print(f"Error processing voice input: {e}")
        return "Sorry, something went wrong!", None, 0  # Default score of 0 if failure



def synthesize_speech(text: str, voice_type: str):
    """
    Converts text to speech using gTTS and saves it as an MP3 file.
    """
    import time
    from gtts import gTTS

    try:
        # ✅ Ensure "static" folder exists
        STATIC_AUDIO_DIR = "static"
        os.makedirs(STATIC_AUDIO_DIR, exist_ok=True)

        # ✅ Generate and save audio
        tts = gTTS(text=text, lang="en", slow=False)
        filename = f"speech_{int(time.time())}.mp3"
        file_path = os.path.join(STATIC_AUDIO_DIR, filename)
        tts.save(file_path)

        # ✅ Return the URL to access the file
        return f"/static/{filename}"

    except Exception as e:
        print(f"Error in TTS synthesis: {e}")
        return None
