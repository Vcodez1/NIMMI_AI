import requests
import json

def test_capture():
    url = "http://localhost:8000/api/chat/variables"
    payload = {
        "bot_id": "d9c5ea9c-f22a-4442-bc0b-4fb9663f6d7c",
        "visitor_session_id": "test-session-123",
        "variable_name": "email",
        "variable_value": "test@example.com"
    }
    headers = {'Content-Type': 'application/json'}
    
    print(f"Sending request to {url}...")
    response = requests.post(url, data=json.dumps(payload), headers=headers)
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response: {response.json()}")
    except:
        print(f"Response (text): {response.text}")

if __name__ == "__main__":
    test_capture()
