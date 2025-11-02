"""
Main FastAPI application module for F1 Analytics Hub Service.

This module initializes the FastAPI application with processing routes and provides
a basic health check endpoint. It serves as the entry point for the F1 data analytics
service, handling Formula 1 race data processing and analysis operations.

The application includes:
- Data processing routes for F1 analytics
- Health check endpoint
- Configurable application settings
"""
from fastapi import FastAPI

from app.api.routes_processing import router as processing_router
from app.core.config import settings

app = FastAPI(title=settings.app_name, version="0.1.0")

app.include_router(processing_router, prefix="/process", tags=["Data Processing"])

@app.get("/")
def root():
    """
    Health check endpoint for the F1 Analytics Hub Service.
    
    Returns:
        dict: A dictionary containing the service status and application name
            with keys 'status' and 'message'.
    """
    return {"status": "ok", "message": f"{settings.app_name} running"}
