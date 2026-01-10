from fastapi import FastAPI

# Create the FastAPI app
app = FastAPI()
@app.get("/")
def home():
    return {"message": "AI BigQuery Chatbot backend is running"}