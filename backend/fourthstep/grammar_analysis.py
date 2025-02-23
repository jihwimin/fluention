import os
from openai import OpenAI
from dotenv import load_dotenv

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
    This version adjusts the sentence to be grammatically correct, considering context.
    """
    try:
        # Send request to GPT-4 for grammar correction
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an advanced grammar assistant for neurodivergent, Aphasia, and Language-impaired individuals. Correct sentences based on a given scenario."},
                {"role": "user", "content": f"Scenario: {scenario_prompt}\nUser's description: {user_sentence}\nIf the sentence is describing a similar scenario as the prompt, then it is almost correct, so only fix the grammar, sentence structure. If not, correct the sentence while keeping the intended meaning intact. Provide suggestions with reasoning."}
            ],
            temperature=0.3
        )

        # Extract the corrected text from the response
        corrected_text = response.choices[0].message.content.strip()
        return corrected_text

    except Exception as e:
        print(f"Error correcting sentence: {e}")
        return "Error processing text."


def score_sentence(user_sentence: str, corrected_sentence: str, scenario_prompt: str):
    """
    Scores the user's sentence based on the scenario prompt and corrected sentence.
    This function evaluates the sentence accuracy and grammar correctness.
    """
    try:
        # Send request to GPT-4 for scoring the sentence
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an AI that evaluates the accuracy and grammatical correctness of a user's description. Give scores based on these factors, but be lenient and supportive, especially for neurodivergent users."},
                {"role": "user", "content": f"Scenario: {scenario_prompt}\nCorrected Sentence: {corrected_sentence}\nUser's Description: {user_sentence}\nRate the accuracy of the user's description from 0 to 100, considering grammar, sentence structure, and relevance. Only return a number."}
            ],
            temperature=0.3
        )

        # Extract and convert the score from the response
        score_text = response.choices[0].message.content.strip()
        score = int(score_text) if score_text.isdigit() else 0  # Safely convert to integer
        return score

    except Exception as e:
        print(f"Error scoring sentence: {e}")
        return 0  # Default score if AI fails


def analyze_sentence(sentence: str, scenario_prompt: str):
    """
    Analyzes the given sentence by performing both correction and scoring.
    Returns a dictionary with original, corrected sentence, and score.
    """
    corrected_text = correct_sentence(sentence, scenario_prompt)  # Pass scenario prompt to correct the sentence
    score = score_sentence(sentence, corrected_text, scenario_prompt)  # Pass all necessary data for scoring

    return {"original": sentence, "corrected": corrected_text, "score": score}
