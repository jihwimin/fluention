import os
from openai import OpenAI
from dotenv import load_dotenv

# ✅ Load environment variables
load_dotenv()

# ✅ Retrieve OpenAI API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("OpenAI API key is missing! Set it in the .env file.")

# ✅ Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

def get_challenging_word():
    """
    Uses GPT-4 to generate a random sophisticated word for the pronunciation game.
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an English language expert. Generate a single, complex, sophisticated word that is challenging to pronounce. Do not provide any definitions or explanations—just return the word."},
                {"role": "user", "content": "Give me a difficult word to pronounce."}
            ],
            temperature=0.8
        )

        word = response.choices[0].message.content.strip()
        return word

    except Exception as e:
        print(f"Error generating word: {e}")
        return "ephemeral"  # Default fallback word if AI request fails

def check_pronunciation(target_word: str, user_said: str):
    """
    Checks if the user's transcribed word matches the AI's chosen word.
    - Returns True if correct, False otherwise.
    """
    return target_word.lower() == user_said.lower()
