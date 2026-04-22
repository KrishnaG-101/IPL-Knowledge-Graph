import argparse
import json
import logging
import apache_beam as beam
from apache_beam.options.pipeline_options import PipelineOptions, StandardOptions, SetupOptions
from google.cloud import spanner

class CalculatePressureIndex(beam.DoFn):
    def process(self, element):
        try:
            # Parse real-time JSON stream element
            payload = json.loads(element.decode('utf-8'))
            
            # Extract basic delivery information
            delivery_id = payload.get('delivery_id')
            over_id = payload.get('over_id')
            bowler_id = payload.get('bowler_id')
            batter_id = payload.get('batter_id')
            speed = payload.get('speed')
            line = payload.get('line')
            result = payload.get('result')
            
            # Calculate Pressure Index using win-probability delta
            win_prob_before = payload.get('win_prob_before', 0.5)
            win_prob_after = payload.get('win_prob_after', 0.5)
            
            # Arbitrary scaling factor for the index
            pressure_index = abs(win_prob_after - win_prob_before) * 100.0
            
            yield {
                'delivery_id': delivery_id,
                'over_id': over_id,
                'bowler_id': bowler_id,
                'batter_id': batter_id,
                'speed': speed,
                'line': line,
                'result': result,
                'pressure_index': pressure_index
            }
        except Exception as e:
            logging.error(f"Error processing element: {e}")


class UpsertToSpannerGraph(beam.DoFn):
    def __init__(self, project_id, instance_id, database_id):
        self.project_id = project_id
        self.instance_id = instance_id
        self.database_id = database_id

    def setup(self):
        # Initialize Spanner client once per worker to minimize connection overhead (<800ms constraint)
        self.spanner_client = spanner.Client(project=self.project_id)
        self.instance = self.spanner_client.instance(self.instance_id)
        self.database = self.instance.database(self.database_id)

    def process(self, element):
        # ISO GQL query to Upsert (MERGE) the Delivery and link to Player nodes
        gql_statement = """
        GRAPH match_state_graph
        MERGE (bowler:Player {Id: @bowler_id})
        MERGE (batter:Player {Id: @batter_id})
        
        -- Insert or merge the Delivery
        MERGE (d:Delivery {Id: @delivery_id})
        SET d.OverId = @over_id, d.PressureIndex = @pressure_index
        
        -- Automatically link the Delivery to the Player nodes
        MERGE (bowler)-[bt:BOWLED_TO {
            Speed: @speed, 
            Line: @line, 
            Result: @result
        }]->(batter)
        """
        
        params = {
            "bowler_id": element['bowler_id'],
            "batter_id": element['batter_id'],
            "delivery_id": element['delivery_id'],
            "over_id": element['over_id'],
            "pressure_index": element['pressure_index'],
            "speed": element['speed'],
            "line": element['line'],
            "result": element['result']
        }
        
        param_types = {
            "bowler_id": spanner.param_types.INT64,
            "batter_id": spanner.param_types.INT64,
            "delivery_id": spanner.param_types.INT64,
            "over_id": spanner.param_types.INT64,
            "pressure_index": spanner.param_types.FLOAT64,
            "speed": spanner.param_types.FLOAT64,
            "line": spanner.param_types.STRING,
            "result": spanner.param_types.STRING
        }
        
        try:
            # Use run_in_transaction for atomic execution
            def insert_graph(transaction):
                transaction.execute_update(
                    gql_statement,
                    params=params,
                    param_types=param_types
                )
            
            self.database.run_in_transaction(insert_graph)
            # Yielding the element for any potential downstream processing
            yield element
        except Exception as e:
            logging.error(f"Failed to execute GQL transaction: {e}")

def run(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument('--input_topic', required=True, help='Pub/Sub topic to read from.')
    parser.add_argument('--spanner_project', required=True)
    parser.add_argument('--spanner_instance', required=True)
    parser.add_argument('--spanner_database', required=True)
    
    known_args, pipeline_args = parser.parse_known_args(argv)
    
    options = PipelineOptions(pipeline_args)
    options.view_as(StandardOptions).streaming = True
    options.view_as(SetupOptions).save_main_session = True

    with beam.Pipeline(options=options) as p:
        (
            p
            | 'ReadFromPubSub' >> beam.io.ReadFromPubSub(topic=known_args.input_topic)
            | 'CalculatePressureIndex' >> beam.ParDo(CalculatePressureIndex())
            | 'UpsertToSpannerGraph' >> beam.ParDo(UpsertToSpannerGraph(
                  project_id=known_args.spanner_project,
                  instance_id=known_args.spanner_instance,
                  database_id=known_args.spanner_database
              ))
        )

if __name__ == '__main__':
    logging.getLogger().setLevel(logging.INFO)
    run()
