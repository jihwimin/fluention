import os
import difflib
from openai import OpenAI
from dotenv import load_dotenv
from score_analysis import calculate_score

# Load environment variables
load_dotenv()

# Retrieve OpenAI API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("OpenAI API key is missing! Set it in the .env file.")

# Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

def correct_sentence(user_sentence: str, scenario_prompt: str):
    """
    Uses GPT-4 to correct the user's sentence based on the original scenario prompt.
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an advanced grammar assistant that corrects sentences for neurodivergent Aphasia, and Language-impaired individuals based on a given scenario prompt."},
                {"role": "user", "content": f"Scenario: {scenario_prompt}\nUser's description: {user_sentence}\nIf the sentence is describing a similar scenario as the prompt, then it is almost correct, so only fix the grammar, sentence structure. If not, Correct the sentence while keeping the intended meaning intact and give specific suggestions with reasoning. Directly give feedback to the user"}
            ],
            temperature=0.3
        )

        corrected_text = response.choices[0].message.content.strip()
        return corrected_text

    except Exception as e:
        print(f"Error correcting sentence: {e}")
        return "Error processing text."

    except Exception as e:
        print(f"Error correcting sentence: {e}")
        return "Error processing text."
    
def score_sentence(user_sentence: str, corrected_sentence: str, scenario_prompt: str):
    """
    Uses GPT-4 to score the user's sentence based on the original scenario prompt and correct sentence.
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an AI that evaluates how accurately a user describes a given scenario and how grammatically correct the sentence is. Be lenient and give good scores, it is for kids"},
                {"role": "user", "content": f"Scenario: {scenario_prompt}\nCorrected Sentence: {corrected_sentence}\nUser's Description: {user_sentence}\nRate the accuracy of the user's description from 0 to 100, considering grammar, sentence structure, and relevance. Only return a number."}
            ],
            temperature=0.3
        )

        score_text = response.choices[0].message.content.strip()
        score = int(score_text) if score_text.isdigit() else 0  # Convert AI output to an integer safely
        return score

    except Exception as e:
        print(f"Error scoring sentence: {e}")
        return 0  # Default score if AI fails

def analyze_sentence(sentence: str):
    """
    Runs both correction and scoring AI to process the given sentence.
    """
    corrected_text = correct_sentence(sentence)
    score = score_sentence(sentence)  # Use AI-based scoring instead of manual calculations

    return {"original": sentence, "corrected": corrected_text, "score": score}
