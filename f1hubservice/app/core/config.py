"""
Configuration module for the F1 Analytics Hub service.

This module provides centralized configuration management for the F1 Analyzer Backend
application using Pydantic settings. It handles loading configuration from environment
variables and .env files, making it easy to manage different environments (development,
staging, production) without code changes.

The module exports a global `settings` instance that can be imported and used throughout
the application to access configuration values.

Example:
    
    print(f"Starting {settings.app_name} on {settings.host}:{settings.port}")
    if settings.debug:
        print("Debug mode is enabled")
"""
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """
    Application configuration settings.

    This class defines the core configuration settings for the F1 Analyzer Backend
    application, including server host/port settings and debug mode. Settings can
    be overridden using environment variables or a .env file.

    Attributes:
        app_name (str): The name of the application. Defaults to "F1 Analyzer Backend".
        debug (bool): Whether to run the application in debug mode. Defaults to True.
        host (str): The host address to bind the server to. Defaults to "127.0.0.1".
        port (int): The port number to run the server on. Defaults to 8000.
    """
    app_name: str = "F1 Analyzer Backend"
    debug: bool = True
    host: str = "127.0.0.1"
    port: int = 8000
    cors_allowed_origins: list[str] = ["*"]
    class Config:
        """
        Configuration class for the F1 Analytics Hub service.

        This class handles application configuration settings and environment variables.
        The configuration is loaded from a .env file to manage environment-specific
        settings such as database connections, API keys, and other service parameters.

        Attributes:
            env_file (str): Path to the environment file containing configuration variables.
                           Defaults to ".env" in the current directory.
        """
        env_file = ".env"

settings = Settings()
