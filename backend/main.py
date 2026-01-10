from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import bigquery
from typing import List, Optional

from backend.ai_sql_generator import generate_sql, explain_results
from backend.bigquery_client import run_query

from backend.ai_sql_generator import (
    generate_sql,
    explain_results,
    handle_small_talk
)



# --------------------
# App setup
# --------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------
# Request model
# --------------------
class QuestionRequest(BaseModel):
    question: str
    history: Optional[List[dict]] = None



# --------------------
# Health check
# --------------------
@app.get("/")
def home():
    return {"message": "AI BigQuery Chatbot backend is running"}


# --------------------
# Helper: Run BigQuery
# --------------------
def run_query(sql: str):
    client = bigquery.Client(project="nlq-gemini-bq-demo")
    query_job = client.query(sql)
    return [dict(row) for row in query_job]


# --------------------
# Ask AI (MAIN CHATBOT ENDPOINT)
# --------------------
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional

from backend.ai_sql_generator import generate_sql, explain_results
from backend.bigquery_client import run_query

# --------------------
# App setup
# --------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------
# Request model
# --------------------
class QuestionRequest(BaseModel):
    question: str
    history: Optional[List[dict]] = None


# --------------------
# Health check
# --------------------
@app.get("/")
def home():
    return {"message": "AI BigQuery Chatbot backend is running"}


# --------------------
# MAIN CHATBOT ENDPOINT
# --------------------
@app.post("/ask")
def ask_ai(request: QuestionRequest):
    user_question = request.question.strip()

    # 1️⃣ Small talk first (human behavior)
    small_talk_response = handle_small_talk(user_question)
    if small_talk_response:
        return {
            "question": user_question,
            "chat_response": small_talk_response,
            "results": []
        }

    # 2️⃣ Data questions
    try:
        sql = generate_sql(user_question, request.history)
        results = run_query(sql)
        explanation = explain_results(user_question, results)

        return {
            "question": user_question,
            "chat_response": explanation,
            "results": results
        }

    except ValueError:
        return {
            "question": user_question,
            "chat_response": (
                "Sorry 🙂 I’m designed to help only with **sales and revenue data**.\n"
                "Try asking something like:\n"
                "• Total revenue by country\n"
                "• Revenue for Germany\n"
                "• Which country performed best?"
            ),
            "results": []
        }
