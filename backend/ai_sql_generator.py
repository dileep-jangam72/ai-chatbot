import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from typing import List, Dict, Optional


def handle_small_talk(question: str) -> str | None:
    q = question.lower().strip()

    greetings = ["hi", "hello", "hey", "good morning", "good evening"]
    how_are_you = ["how are you", "how r u", "how are u"]
    thanks = ["thanks", "thank you", "thx"]
    about = ["who are you", "what are you", "what can you do", "help"]

    if any(q == g or q.startswith(g) for g in greetings):
        return "Hi 👋 I’m your AI Data Assistant. You can ask me questions about sales and revenue data."

    if any(h in q for h in how_are_you):
        return "I’m doing great 😊 Thanks for asking! How can I help you with your data today?"

    if any(t in q for t in thanks):
        return "You’re welcome 🙂 Happy to help with your data anytime."

    if any(a in q for a in about):
        return (
            "I’m an AI Data Assistant 🤖📊\n"
            "I help answer questions about sales, revenue, and performance "
            "using your data."
        )

    return None

# ====================
# SQL SANITIZER (VERY IMPORTANT)
# ====================
def clean_sql(sql: str) -> str:
    sql = sql.strip()

    # Remove markdown fences if model returns them
    if sql.startswith("```"):
        sql = sql.replace("```sql", "").replace("```", "").strip()

    # Safety check
    if not sql.lower().startswith("select"):
        raise ValueError("Generated SQL is not a SELECT query")

    return sql


# ====================
# ENV SETUP
# ====================
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"
load_dotenv(dotenv_path=ENV_PATH)

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise RuntimeError("GEMINI_API_KEY not loaded")

client = genai.Client(api_key=api_key)


# ====================
# DATA QUESTION CHECK
# ====================
def is_data_question(question: str) -> bool:
    """
    Lightweight guardrail to ensure chatbot is data-only
    """
    keywords = [
        "revenue", "sales", "country", "order",
        "total", "sum", "average", "avg",
        "highest", "lowest", "top", "bottom",
        "data", "performance", "trend", "by",
        "group", "compare", "list", "show"
    ]
    q = question.lower()
    return any(word in q for word in keywords)


# ====================
# SQL GENERATION
# ====================
def generate_sql(
    question: str,
    history: Optional[List[Dict[str, str]]] = None
) -> str:
    """
    Converts natural language to BigQuery SQL
    """

    if not is_data_question(question):
        raise ValueError(
            "Sorry 🙂 I can only answer questions related to sales data."
        )

    history_block = ""
    if history:
        history_block = "\nConversation context:\n"
        for h in history[-3:]:
            history_block += f"- User: {h.get('content', '')}\n"

    prompt = f"""
You are a senior data analyst writing BigQuery SQL.

STRICT RULES (VERY IMPORTANT):
- Generate ONLY a SELECT query
- NO INSERT, UPDATE, DELETE, DROP
- NO explanations, comments, or markdown
- Use ONLY the schema provided
- ALWAYS alias aggregated columns clearly
  (example: SUM(revenue) AS total_revenue)
- If the user asks a follow-up question, infer context logically

Dataset: chatbot
Table: sales_data

Schema:
- order_id STRING
- country STRING
- order_date DATE
- revenue FLOAT
{history_block}

User question:
{question}

Return ONLY valid BigQuery SQL.
"""

    response = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=prompt
    )

    raw_sql = response.text.strip()

    # 🔐 IMPORTANT: sanitize before returning
    return clean_sql(raw_sql)


# ====================
# CHAT-LIKE EXPLANATION
# ====================
def explain_results(
    question: str,
    results: List[Dict]
) -> str:
    """
    Turns raw query results into a human, chat-style response
    """

    if not results:
        return (
            "I checked the data, but there’s no matching information "
            "for that question."
        )

    prompt = f"""
You are an AI data assistant similar to ChatGPT.

The user asked:
"{question}"

The data result is:
{results}

Your task:
- Explain the answer in clear, friendly English
- Focus on insights, not raw numbers
- Compare values if relevant
- Sound natural and conversational
- Do NOT mention SQL, BigQuery, tables, or databases
- Do NOT repeat the raw JSON

Example tone:
"Here’s what I found…" or "Looks like…"

Keep it short, helpful, and human.
"""

    response = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=prompt
    )

    return response.text.strip()
