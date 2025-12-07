"""
FastAPI router module for data about drivers.

Routes:
    GET /driver/{driver_id}: Retrieves information about a specific driver by ID.

Dependencies:
    - FastAPI for API routing and HTTP exception handling
    - Custom schemas for request/response models
    - Logger for operation tracking
    - Data processor service for mathematical operations
"""
from fastapi import APIRouter, HTTPException
from app.models.schemas import SeasonSchedule
from app.core.logger import logger
from app.services.info_processor import get_season_schedule

router = APIRouter()

@router.get("/schedule/{year}", response_model=SeasonSchedule)
def get_schedule(year: int = 2025) -> SeasonSchedule:
    """
    Fetch the season schedule for a specific year.

    Args:
        year (int): The year for which to retrieve the season schedule.

    Returns:
        dict: The season schedule for the specified year.
    """
    try:
        logger.info("Fetching season schedule for year %s", year)
        schedule_data = get_season_schedule(year)
        logger.info("Successfully fetched season schedule for year %s: %s", year, schedule_data)
        return schedule_data
    except Exception as exc:
        logger.exception("Failed to fetch season schedule")
        raise HTTPException(status_code=500, detail=str(exc))
