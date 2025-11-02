"""
FastAPI router module for data processing and mathematical operations.

This module provides API endpoints for analyzing data records and performing
mathematical operations. It includes error handling and logging for all operations.

Routes:
    POST /analyze: Analyzes and processes data records from a DataRequest
    GET /mathadd: Performs addition operation on two numbers

Dependencies:
    - FastAPI for API routing and HTTP exception handling
    - Custom schemas for request/response models
    - Logger for operation tracking
    - Data processor service for mathematical operations
"""
from fastapi import APIRouter, HTTPException
from app.models.schemas import DataRequest, DataResponse, MathAddRequest, MathAddResponse
from app.core.logger import logger
from app.services.data_processor import process_data

router = APIRouter()

@router.post("/analyze", response_model=DataResponse)
def analyze_data(req: DataRequest):
    """
    Analyze and process data records from a DataRequest.
    This function receives a DataRequest containing records and processes them.
    Currently returns a test response indicating processing completion.
    Args:
        req (DataRequest): The data request object containing records to be analyzed.
    Returns:
        dict: A dictionary with processing status. Currently returns 
        {"testing": "Processing complete"}.
    Raises:
        HTTPException: Raised with status code 500 if processing fails, containing 
        the error details.
    """

    try:
        logger.info("Received %d records for processing", len(req.records))
        return {"testing": "Processing complete"}
    except Exception as exc:
        logger.exception("Processing failed")
        raise HTTPException(status_code=500, detail=str(exc))

@router.post("/mathadd", response_model = MathAddResponse)
def do_math(req: MathAddRequest):
    """
    Performs mathematical addition operation on two numbers from a request object.
    Args:
        req (MathAddRequest): Request object containing x and y values to be added.
    Returns:
        dict: A dictionary containing the result of the addition operation with key 'result'.
    Raises:
        HTTPException: Raised with status code 500 if the math operation fails.
    """
    try:
        logger.info("Adding %d and %d", req.x, req.y)
        output = process_data(req.x, req.y)
        return {"result": output}
    except Exception as exc:
        logger.exception("Math addition failed")
        raise HTTPException(status_code=500, detail=str(exc))
