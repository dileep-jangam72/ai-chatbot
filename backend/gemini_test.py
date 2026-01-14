import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai

# Absolute path to project root .env
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"

print("Looking for .env at:", ENV_PATH)

# Force load .env
load_dotenv(dotenv_path=ENV_PATH)

api_key = os.getenv("GEMINI_API_KEY")

print("API KEY FOUND:", bool(api_key))

if not api_key:
    raise RuntimeError("GEMINI_API_KEY not loaded. Check .env file.")

client = genai.Client(api_key=api_key)

response = client.models.generate_content(
    model="models/gemini-2.5-flash",
    contents="Say OK"
)

print(response.text)