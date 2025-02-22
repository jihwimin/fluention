import requests
import os
from dotenv import load_dotenv

load_dotenv()

DALLE_API_KEY = os.getenv("DALLE_API_KEY")

def generate_image(difficulty):
    prompt = "A simple everyday situation for beginners" if difficulty == "easy" else "A complex scene with multiple actions"
    url = "https://api.openai.com/v1/images/generations"
    headers = {
        "Authorization": f"Bearer {DALLE_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "prompt": prompt,
        "n": 1,
        "size": "512x512"
    }
    response = requests.post(url, headers=headers, json=payload)
    return response.json()["data"][0]["url"] if response.status_code == 200 else None
