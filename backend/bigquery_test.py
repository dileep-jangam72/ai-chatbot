from google.cloud import bigquery

# Create BigQuery client
client = bigquery.Client(project="nlq-gemini-bq-demo")

# SQL query
query = """
SELECT
  order_id,
  country,
  order_date,
  revenue
FROM `nlq-gemini-bq-demo.chatbot.sales_data`
ORDER BY order_date
"""

# Run the query
query_job = client.query(query)

print("BigQuery results:")
for row in query_job:
    print(dict(row))
