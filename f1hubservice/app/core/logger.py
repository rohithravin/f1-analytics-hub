"""
Logging configuration module for F1 Analytics Hub.

This module sets up the logging configuration for the F1 analyzer application,
providing a centralized logger instance with standardized formatting.

The logger is configured with INFO level and includes timestamp, log level,
logger name, and message in the output format.
"""
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)

logger = logging.getLogger("f1-analyzer")
