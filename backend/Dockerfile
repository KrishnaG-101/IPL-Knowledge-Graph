FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY polling_service.py polling_service.py

# Expected to be passed at runtime or securely via Secret Manager
ENV RAPIDAPI_KEY="YOUR_RAPIDAPI_KEY" 
ENV PROJECT_ID="cricket-graph-intelligence"
ENV PORT=8080

EXPOSE 8080

CMD ["python", "polling_service.py"]
