"""
Unit tests for F1 schedule API endpoints.

This module contains tests for the schedule endpoints that fetch
season schedules using the FastF1 library.
"""
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_schedule_current_year():
    """Test fetching schedule for current year (2025)."""
    resp = client.get("/schedule/2025")
    assert resp.status_code == 200
    data = resp.json()
    
    # Verify response structure
    assert "year" in data
    assert "rounds" in data
    assert data["year"] == 2025
    assert isinstance(data["rounds"], list)
    assert len(data["rounds"]) > 0


def test_get_schedule_2024():
    """Test fetching schedule for 2024 season."""
    resp = client.get("/schedule/2024")
    assert resp.status_code == 200
    data = resp.json()
    
    assert data["year"] == 2024
    assert isinstance(data["rounds"], list)
    assert len(data["rounds"]) > 0


def test_get_schedule_2023():
    """Test fetching schedule for 2023 season."""
    resp = client.get("/schedule/2023")
    assert resp.status_code == 200
    data = resp.json()
    
    assert data["year"] == 2023
    assert isinstance(data["rounds"], list)
    assert len(data["rounds"]) > 0


def test_schedule_round_structure():
    """Test that each round has required fields."""
    resp = client.get("/schedule/2024")
    assert resp.status_code == 200
    data = resp.json()
    
    # Check first round structure
    round_data = data["rounds"][0]
    required_fields = [
        "RoundNumber", "Country", "Location", "OfficialEventName",
        "EventName", "EventDate", "EventFormat", "GP", "GPDateUtc"
    ]
    
    for field in required_fields:
        assert field in round_data, f"Missing required field: {field}"


def test_schedule_conventional_format():
    """Test that conventional format rounds have correct session structure."""
    resp = client.get("/schedule/2024")
    assert resp.status_code == 200
    data = resp.json()
    
    # Find a conventional format round
    conventional_rounds = [r for r in data["rounds"] if r["EventFormat"] == "Conventional"]
    
    if conventional_rounds:
        round_data = conventional_rounds[0]
        conventional_fields = ["FP1", "FP1DateUtc", "FP2", "FP2DateUtc", 
                               "FP3", "FP3DateUtc", "Quali", "QualiDateUtc"]
        
        for field in conventional_fields:
            assert field in round_data, f"Missing conventional field: {field}"


def test_schedule_sprint_format():
    """Test that sprint format rounds have correct session structure."""
    resp = client.get("/schedule/2024")
    assert resp.status_code == 200
    data = resp.json()
    
    # Find a sprint format round
    sprint_rounds = [r for r in data["rounds"] 
                     if r["EventFormat"] in ["Sprint Qualifying", "Sprint Shootout"]]
    
    if sprint_rounds:
        round_data = sprint_rounds[0]
        sprint_fields = ["FP1", "FP1DateUtc", "Sprint", "SprintDateUtc", 
                        "Quali", "QualiDateUtc"]
        
        for field in sprint_fields:
            assert field in round_data, f"Missing sprint field: {field}"


def test_schedule_round_number_sequence():
    """Test that round numbers are sequential."""
    resp = client.get("/schedule/2024")
    assert resp.status_code == 200
    data = resp.json()
    
    rounds = data["rounds"]
    for i, round_data in enumerate(rounds):
        assert round_data["RoundNumber"] == i + 1, \
            f"Round number mismatch at index {i}"


def test_schedule_invalid_year_future():
    """Test that requesting a far future year handles gracefully."""
    resp = client.get("/schedule/2030")
    # Should either return 500 or empty schedule depending on implementation
    assert resp.status_code in [200, 500]


def test_schedule_old_year():
    """Test fetching schedule for an older year (2018)."""
    resp = client.get("/schedule/2018")
    assert resp.status_code == 200
    data = resp.json()
    
    assert data["year"] == 2018
    assert isinstance(data["rounds"], list)
    assert len(data["rounds"]) > 0


def test_schedule_event_date_format():
    """Test that EventDate is in correct format."""
    resp = client.get("/schedule/2024")
    assert resp.status_code == 200
    data = resp.json()
    
    # Check date format in first round
    round_data = data["rounds"][0]
    event_date = round_data["EventDate"]
    
    # Verify it's a date string (YYYY-MM-DD format)
    assert isinstance(event_date, str)
    assert len(event_date.split("-")) == 3


def test_schedule_gp_date_utc_format():
    """Test that GPDateUtc is in ISO format."""
    resp = client.get("/schedule/2024")
    assert resp.status_code == 200
    data = resp.json()
    
    round_data = data["rounds"][0]
    gp_date = round_data["GPDateUtc"]
    
    # Verify it's an ISO datetime string
    assert isinstance(gp_date, str)
    assert "T" in gp_date or " " in gp_date
