# IPL Knowledge Graph

A real-time IPL Knowledge Graph application that surfaces tactical insights, utilizing Spanner Graph and Vertex AI.

## Project Structure

- **`frontend/`**: React-based "Mission Control" dashboard that visualizes live match states and tactical shifts.
- **`backend/`**: Python-based polling service providing live match updates.
- **`cf_reasoning_path/`**: Cloud Functions dedicated to end-of-over tactical analysis.
- **`hot_path_pipeline.py` & `setup_graph.js`**: Core pipeline scripts for ball-by-ball updates and graph management.
- **`DESIGN.md`**: Contains information about tokens and design system choices.

## Getting Started

1. Set up your GCP credentials by placing an active `gcp-creds.json` inside the root directory. This explicitly should **not** be tracked by version control.
2. Initialize backend dependencies and run the backend service.
3. Start the frontend via `cd frontend && npm install && npm run dev`.
