from google.cloud import bigquery

# Create BigQuery client
client = bigquery.Client(project="nlq-gemini-bq-demo")

def get_sales_data():
    query = """
    SELECT
      order_id,
      country,
      order_date,
      revenue
    FROM `nlq-gemini-bq-demo.chatbot.sales_data`
    ORDER BY order_date
    """

    query_job = client.query(query)

    results = []
    for row in query_job:
        results.append(dict(row))

    return results