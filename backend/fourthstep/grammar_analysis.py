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

def correct_sentence(user_sentence: str):
    """
    Uses GPT-4 to correct grammar while preserving meaning.
    Returns the corrected sentence only if needed.
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an advanced language assistant. Correct sentences for neurodivergent and language-impaired individuals **only if needed and their sentence does not make sense**. Punctuations do not matter."},
                {"role": "user", "content": f"Fix the grammar, but keep the meaning the same: '{user_sentence}'"}
            ],
            temperature=0.3
        )

        corrected_text = response.choices[0].message.content.strip()

        # ✅ If sentence is **already correct**, return original
        if corrected_text == user_sentence:
            return user_sentence, False  # False = No correction needed

        return corrected_text, True  # True = Correction applied

    except Exception as e:
        print(f"Error correcting sentence: {e}")
        return "Error processing text.", False


def analyze_sentence(sentence: str):
    """
    Runs grammar correction **only if needed** and returns:
    - Original text
    - Corrected text (if changed)
    - AI conversation score (always high for encouragement)
    """
    corrected_text, corrected = correct_sentence(sentence)

    # ✅ If no correction needed, return high score for encouragement
    score = 100 if not corrected else 90  # 90 if correction was needed

    return {"original": sentence, "corrected": corrected_text, "score": score, "corrected_flag": corrected}
