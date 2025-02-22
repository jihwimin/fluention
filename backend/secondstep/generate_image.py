import os
import requests
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

DALLE_API_KEY = os.getenv("DALLE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not DALLE_API_KEY or not OPENAI_API_KEY:
    raise ValueError("Missing API key! Ensure DALLE_API_KEY and OPENAI_API_KEY are set in .env file.")

# Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

def generate_scenario():
    """
    Uses GPT-4 to generate a short, simple scenario (1-2 sentences) for DALL·E image generation.
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an AI that generates short, simple, and clear scenarios for image generation."},
                {"role": "user", "content": "Generate a short, simple, easy, one to two-sentence scenario that is real life scenes that little kids can describe easily"}
            ],
            temperature=0.7
        )

        scenario_prompt = response.choices[0].message.content.strip()
        return scenario_prompt

    except Exception as e:
        print(f"Error generating scenario: {e}")
        return "A person is walking their dog in the park."

def generate_image():
    """
    Uses GPT-4 to generate a scenario and DALL·E to create an image based on that scenario.
    """
    scenario_prompt = generate_scenario()

    url = "https://api.openai.com/v1/images/generations"
    headers = {
        "Authorization": f"Bearer {DALLE_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "prompt": scenario_prompt,
        "n": 1,
        "size": "512x512"
    }

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code == 200:
        return {"image_url": response.json()["data"][0]["url"], "scenario_prompt": scenario_prompt}
    else:
        print(f"Error generating image: {response.json()}")
        return None
