import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai

# Load .env explicitly
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"
load_dotenv(dotenv_path=ENV_PATH)

api_key = os.getenv("GEMINI_API_KEY")
print("API KEY FOUND:", bool(api_key))

client = genai.Client(api_key=api_key)

print("\nAVAILABLE MODELS:\n")

models = list(client.models.list())

print(f"Total models returned: {len(models)}\n")

for model in models:
    print("Model name:", model.name)
    print("Model object:", model)
    print("-" * 40)