# IPL Knowledge Graph Project Rules

## Core Constraints
1. **Schema**: Use ISO GQL for Spanner Graph schemas.
2. **Data Paths**: Implement a 'Hot Path' for ball-by-ball updates and a 'Reasoning Path' for end-of-over 'Invisible Shifts'.
3. **Latency**: Optimize for Google Cloud sub-5ms internal VPC latency.

## Technology Stack
- Spanner Graph (GQL)
- Dataflow
- BigQuery ML
- Gemini 1.5 Pro/Flash via Vertex AI
