import openai
import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def correct_sentence(sentence):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an AI language therapist that corrects grammar and improves sentence clarity."},
            {"role": "user", "content": f"Fix this sentence: {sentence}"}
        ],
        api_key=GROQ_API_KEY
    )
    return response["choices"][0]["message"]["content"]
