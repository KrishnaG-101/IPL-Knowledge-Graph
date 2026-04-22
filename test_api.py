import requests
import json

RAPIDAPI_KEY = "YOUR_RAPIDAPI_KEY"
API_HOST = "cricbuzz-cricket.p.rapidapi.com"
HEADERS = {
    "X-RapidAPI-Key": RAPIDAPI_KEY,
    "X-RapidAPI-Host": API_HOST
}

url = f"https://{API_HOST}/matches/v1/live"
response = requests.get(url, headers=HEADERS)
data = response.json()

for type_matches in data.get("typeMatches", []):
    for series in type_matches.get("seriesMatches", []):
        for match in series.get("seriesAdWrapper", {}).get("matches", []):
            if "seriesName" in match.get("matchInfo", {}) and "IPL" in match.get("matchInfo", {}).get("seriesName", ""):
                 print(f"FOUND IPL MATCH: {match['matchInfo']['matchId']}")
                 
print("Done")
