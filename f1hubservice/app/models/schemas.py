"""
Pydantic schema models for F1 Analytics Hub service.

This module defines the request and response data models used for API endpoints
in the F1 Analytics Hub service. These schemas provide validation and 
serialization for data transfer objects.
"""
from typing import List
from pydantic import BaseModel


class DataRequest(BaseModel):
    """
    Request schema for data operations.
    
    Attributes:
        records (List[str]): A list of record identifiers or data entries
                           to be processed by the service.
    """
    records: List[str]

class DataResponse(BaseModel):
    """
    Response schema for data operations.
    
    Attributes:
        testing (str): A testing field for response data.
    """
    testing: str

class MathAddRequest(BaseModel):
    """
    Request schema for addition operation.
    
    Attributes:
        x (int): The first integer to add.
        y (int): The second integer to add.
    """
    x: int
    y: int

class MathAddResponse(BaseModel):
    """
    Response schema for addition operation.
    
    Attributes:
        result (int): The result of adding x and y.
    """
    result: int
