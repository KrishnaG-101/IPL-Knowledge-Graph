import base64
import json
import logging
from google.cloud import spanner
from google.cloud import bigquery
import functions_framework
import vertexai
from vertexai.generative_models import GenerativeModel, GenerationConfig

# Initialize clients globally for reuse
PROJECT_ID = 'cricket-graph-intelligence'
SPANNER_INSTANCE = 'cricket-spanner-instance'
SPANNER_DB = 'match_state_graph'

spanner_client = spanner.Client(project=PROJECT_ID)
spanner_instance = spanner_client.instance(SPANNER_INSTANCE)
spanner_database = spanner_instance.database(SPANNER_DB)
bq_client = bigquery.Client(project=PROJECT_ID)

vertexai.init(project=PROJECT_ID, location="us-central1")
model = GenerativeModel("gemini-1.5-pro")

@functions_framework.cloud_event
def analyze_over(cloud_event):
    """
    Triggered by a Pub/Sub message at the end of every over.
    Payload expected: {"over_id": 123, "bowler_id": 45, "batter_id": 12}
    """
    try:
        # 1. Parse Event Payload
        pubsub_message = cloud_event.data["message"]["data"]
        payload_str = base64.b64decode(pubsub_message).decode("utf-8")
        payload = json.loads(payload_str)
        
        over_id = payload.get("over_id")
        bowler_id = payload.get("bowler_id")
        batter_id = payload.get("batter_id")
        
        if not over_id or not batter_id:
            logging.error("Missing critical data from payload.")
            return
            
        logging.info(f"Analyzing Over: {over_id} for Batter: {batter_id}")

        # 2. Query Spanner Graph for the last 6 deliveries in this over
        # We can use standard SQL against the underlying edge/node tables for straightforward property extraction
        spanner_query = """
            SELECT d.Id as DeliveryId, b.Speed, b.Line, b.Result 
            FROM Delivery d
            JOIN BowledTo b ON d.Id = b.DeliveryId
            WHERE d.OverId = @over_id
            ORDER BY d.Id ASC
        """
        
        deliveries = []
        with spanner_database.snapshot() as snapshot:
            results = snapshot.execute_sql(
                spanner_query,
                params={"over_id": over_id},
                param_types={"over_id": spanner.param_types.INT64}
            )
            for row in results:
                deliveries.append({
                    "delivery_id": row[0],
                    "speed": row[1],
                    "line": row[2],
                    "result": row[3]
                })

        if not deliveries:
            logging.info("No deliveries found for this over.")
            return

        # 3. Query BigQuery for historical 'comfort zone'
        bq_query = """
            SELECT comfort_zone_description 
            FROM `cricket-graph-intelligence.player_stats.comfort_zones` 
            WHERE player_id = @batter_id
            LIMIT 1
        """
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("batter_id", "INT64", batter_id)
            ]
        )
        bq_result = bq_client.query(bq_query, job_config=job_config).result()
        comfort_zone = "Unknown"
        for row in bq_result:
            comfort_zone = row.comfort_zone_description

        # 4. Use Vertex AI Gemini 1.5 Pro to compare and analyze
        prompt = f"""
        You are an expert cricket tactician.
        
        Batter's Historical Comfort Zone:
        {comfort_zone}
        
        Sequenced Deliveries in this Over:
        {json.dumps(deliveries, indent=2)}
        
        Analyze the sequence of these deliveries against the batter's comfort zone. 
        Identify if the bowler is 'setting a trap' (e.g., intentionally bowling wide outside off stump to force a loose drive, or bowling short to push the batter back before pitching it up).
        Look for anomalies not immediately obvious from the raw box-score.
        
        Return exactly ONE valid JSON object with the following schema:
        {{
            "anomaly_detected": bool,
            "trap_type": "None" | string describing the trap,
            "description": string providing a tactical breakdown
        }}
        """

        generation_config = GenerationConfig(
            temperature=0.2,
            response_mime_type="application/json"
        )
        
        response = model.generate_content(
            prompt,
            generation_config=generation_config
        )

        # 5. Output Tactical Insight
        insight = json.loads(response.text)
        
        if insight.get("anomaly_detected"):
            logging.info(f"TACTICAL INSIGHT GENERATED: {json.dumps(insight)}")
            # Future extension: Write this insight back to Spanner Graph as an 'OverInsight' node
            # or a 'TACTICAL_SHIFT' edge.
        else:
            logging.info("Routine over. No anomaly or trap detected.")

    except Exception as e:
        logging.error(f"Error executing analyze_over function: {e}")
