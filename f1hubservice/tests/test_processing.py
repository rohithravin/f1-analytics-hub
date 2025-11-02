from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_mathadd_basic():
    payload = {
        "x": 100,
        "y": 200,
    }
    resp = client.post("/process/mathadd", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["result"] == 300


def test_analyze_basic():
    payload = {
        "records": [
            "1", "2", "3"
        ]
    }
    resp = client.post("/process/analyze", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data == {"testing": "Processing complete"}
