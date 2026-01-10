from google.cloud import bigquery

# Create BigQuery client
client = bigquery.Client(project="nlq-gemini-bq-demo")


def run_query(sql: str):
    """
    Executes a SELECT query on BigQuery and returns results as list of dicts
    """

    if not sql or not sql.strip():
        raise ValueError("SQL query is empty")

    # Extra safety: allow only SELECT
    if not sql.strip().lower().startswith("select"):
        raise ValueError("Only SELECT queries are allowed")

    print("Executing SQL:\n", sql)  # Debug log (very useful)

    query_job = client.query(sql)

    results = []
    for row in query_job.result():
        results.append(dict(row))

    return results
