"""
Pydantic schema models for F1 Analytics Hub service.

This module defines the request and response data models used for API endpoints
in the F1 Analytics Hub service. These schemas provide validation and 
serialization for data transfer objects.
"""
from datetime import datetime, date
from typing import List
from pydantic import BaseModel
from typing import Optional, Literal, Union

class RoundBase(BaseModel):
    """
    Base model for Formula 1 race round information.
    This class represents the fundamental structure for storing details about
    a Formula 1 race round, including location, timing, and event information.
    Attributes:
        RoundNumber (int): The sequential number of the race round in the season
        Country (str): The country where the race takes place
        Location (str): The specific location/city where the race is held
        OfficialEventName (str): The complete official name of the racing event
        EventName (str): A shorter or common name for the event
        EventDate (date): The date when the main race event occurs
        GP (str): The Grand Prix designation or abbreviation
        GPDateUtc (datetime): The race date and time in UTC format
    """
    RoundNumber: int
    Country: str
    Location: str
    OfficialEventName: str
    EventName: str
    EventDate: date
    GP: str
    GPDateUtc: datetime

class RoundInfo(RoundBase):
    """
    Schema for round information containing practice sessions and qualifying details.
    This class extends RoundBase to include comprehensive information about a Formula 1
    race weekend, including all practice sessions and qualifying session details.
    Attributes:
        EventFormat (Literal["Conventional"]): The format type of the event, currently 
            only supports conventional race weekend format.
        FP1 (str): Free Practice 1 session identifier or description.
        FP1DateUtc (datetime): UTC date and time when Free Practice 1 session occurs.
        FP2 (str): Free Practice 2 session identifier or description.
        FP2DateUtc (datetime): UTC date and time when Free Practice 2 session occurs.
        FP3 (str): Free Practice 3 session identifier or description.
        FP3DateUtc (datetime): UTC date and time when Free Practice 3 session occurs.
        Quali (str): Qualifying session identifier or description.
        QualiDateUtc (datetime): UTC date and time when Qualifying session occurs.
    """
    EventFormat: Literal["Conventional"]

    FP1: str
    FP1DateUtc: Optional[datetime]

    FP2: str
    FP2DateUtc: Optional[datetime]

    FP3: str
    FP3DateUtc: Optional[datetime]

    Quali: str
    QualiDateUtc: Optional[datetime]

class RoundSprintInfo(RoundBase):
    """
    Schema for Formula 1 sprint race weekend round information.
    This class represents a sprint weekend format where sprint qualifying and sprint race
    are held in addition to the standard qualifying and race sessions.
    Attributes:
        EventFormat: Literal format specifier indicating "Sprint Qualifying" weekend type
        FP1: Free Practice 1 session identifier/name
        FP1DateUtc: UTC datetime for Free Practice 1 session
        SprintQuali: Sprint qualifying session identifier/name  
        SprintQualiDateUtc: UTC datetime for sprint qualifying session
        Sprint: Sprint race session identifier/name
        SprintDateUtc: UTC datetime for sprint race session
        Quali: Main qualifying session identifier/name
        QualiDateUtc: UTC datetime for main qualifying session
    Inherits from:
        RoundBase: Base class containing common round properties
    """
    EventFormat: Literal["Sprint Qualifying"]

    FP1: str
    FP1DateUtc: Optional[datetime]

    SprintQuali: str
    SprintQualiDateUtc: Optional[datetime]

    Sprint: str
    SprintDateUtc: Optional[datetime]

    Quali: str
    QualiDateUtc: Optional[datetime]

class RoundSprintShootoutInfo(RoundBase):
    """
    Schema for Formula 1 sprint race weekend round information.
    This class represents a sprint weekend format where sprint qualifying and sprint race
    are held in addition to the standard qualifying and race sessions.
    Attributes:
        EventFormat: Literal format specifier indicating "Sprint Qualifying" weekend type
        FP1: Free Practice 1 session identifier/name
        FP1DateUtc: UTC datetime for Free Practice 1 session
        SprintQuali: Sprint qualifying session identifier/name  
        SprintQualiDateUtc: UTC datetime for sprint qualifying session
        Sprint: Sprint race session identifier/name
        SprintDateUtc: UTC datetime for sprint race session
        Quali: Main qualifying session identifier/name
        QualiDateUtc: UTC datetime for main qualifying session
    Inherits from:
        RoundBase: Base class containing common round properties
    """
    EventFormat: Literal["Sprint Shootout"]

    FP1: str
    FP1DateUtc: Optional[datetime]

    Quali: str
    QualiDateUtc: Optional[datetime]

    FP2: str
    FP2DateUtc: Optional[datetime]

    Sprint: str
    SprintDateUtc: Optional[datetime]

class SeasonSchedule(BaseModel):
    """
    Represents a complete Formula 1 season schedule.
    This model contains the schedule for an entire F1 season, including all race rounds
    and sprint race rounds for a given year.
    Attributes:
        year (int): The year of the F1 season (e.g., 2023, 2024)
        rounds (List[Union[RoundInfo, RoundSprintInfo]]): A list of race rounds in the season.
            Each round can be either a regular race weekend (RoundInfo) or a sprint race
            weekend (RoundSprintInfo).
    Example:
        >>> schedule = SeasonSchedule(
        ...     year=2023,
        ...     rounds=[round1, round2, sprint_round3]
        ... )
    """
    year: int
    rounds: List[Union[RoundInfo, RoundSprintInfo, RoundSprintShootoutInfo]]


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
