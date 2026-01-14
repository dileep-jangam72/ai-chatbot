from google.cloud import bigquery

client = bigquery.Client()

query = (
    "SELECT COUNT(*) AS cnt "
    "FROM `nlq-gemini-bq-demo.chatbot.sales_data`"
)

job = client.query(query)
rows = list(job)

print(rows[0])
