import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Retrieve OpenAI API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Validate API key before proceeding
if not OPENAI_API_KEY:
    raise ValueError("OpenAI API key is missing! Set it in the .env file.")

# Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

def analyze_sentence(sentence: str):
    """
    Analyzes and corrects a given sentence using OpenAI's GPT model.
    Returns corrected text.
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an advanced grammar assistant that corrects sentences for neurodivergent Aphasia, and Language-impaired individuals."},
                {"role": "user", "content": f"Correct this sentence and give specific suggestions with reasoning: {sentence}"}
            ],
            temperature=0.3
        )

        # Extract AI-generated response
        corrected_text = response.choices[0].message.content.strip()

        return corrected_text  # ✅ Return only the corrected text (not a dictionary)

    except Exception as e:
        print(f"Error processing text: {e}")
        return "Error processing text"  # ✅ Return a string instead of a dictionary
