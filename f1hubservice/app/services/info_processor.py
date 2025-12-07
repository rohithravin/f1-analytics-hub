"""
F1 Season Schedule Information Processor

This module provides functionality to fetch and process Formula 1 season schedules
using the FastF1 library. It handles different event formats including conventional
weekends and sprint qualifying formats.

Author: Rohith Ravindranath
"""
import pandas as pd
import fastf1
from app.models.schemas import SeasonSchedule

def get_season_schedule(year: int = 2025) -> SeasonSchedule:
    """Fetch the season schedule for a specific year.
    Args:
        year (int): The year for which to fetch the season schedule.
    Returns:
        SeasonSchedule: The season schedule.
    """
    def safe_session(value):
        return "Cancelled" if pd.isna(value) or value == '' else value
    
    def safe_datetime(ts):
        """Return None if ts is NaT or null, else convert to datetime."""
        if pd.isna(ts):
            return None
        # If it's already datetime, return as-is; else convert
        if hasattr(ts, "to_pydatetime"):
            return ts.to_pydatetime()
        return ts

    try:
        schedule = fastf1.get_event_schedule(year, include_testing=False)
    except Exception as e:
        raise RuntimeError(f"Error fetching season schedule for year {year}: {e}") from e

    schedule = schedule[['RoundNumber', 'Country', 'Location', 'OfficialEventName', 'EventDate',
        'EventName', 'EventFormat', 'Session1',
        'Session1DateUtc', 'Session2',  'Session2DateUtc',
        'Session3', 'Session3DateUtc', 'Session4',
        'Session4DateUtc', 'Session5', 'Session5DateUtc']]
    schedule_dict = []
    for _ , row in schedule.iterrows():
        round_info = {}
        round_info['RoundNumber'] = row['RoundNumber']
        round_info['Country'] = row['Country']
        round_info['Location'] = row['Location']
        round_info['OfficialEventName'] = row['OfficialEventName']
        round_info['EventDate'] = safe_datetime(row['EventDate'])
        round_info['EventName'] = row['EventName']
        if row['EventFormat'] == 'conventional':
            round_info['EventFormat'] = "Conventional"
            round_info['FP1'] = safe_session(row['Session1'])
            round_info['FP1DateUtc'] = safe_datetime(row['Session1DateUtc'])
            round_info['FP2'] = safe_session(row['Session2'])
            round_info['FP2DateUtc'] = safe_datetime(row['Session2DateUtc'])
            round_info['FP3'] = safe_session(row['Session3'])
            round_info['FP3DateUtc'] = safe_datetime(row['Session3DateUtc'])
            round_info['Quali'] = safe_session(row['Session4'])
            round_info['QualiDateUtc'] = safe_datetime(row['Session4DateUtc'])
        elif row['EventFormat'] == 'sprint_qualifying' or row['EventFormat'] == 'sprint_shootout':
            round_info['EventFormat'] = "Sprint Qualifying"
            round_info['FP1'] = safe_session(row['Session1'])
            round_info['FP1DateUtc'] = safe_datetime(row['Session1DateUtc'])
            round_info['SprintQuali'] = safe_session(row['Session2'])
            round_info['SprintQualiDateUtc'] = safe_datetime(row['Session2DateUtc'])
            round_info['Sprint'] = safe_session(row['Session3'])
            round_info['SprintDateUtc'] = safe_datetime(row['Session3DateUtc'])
            round_info['Quali'] = safe_session(row['Session4'])
            round_info['QualiDateUtc'] = safe_datetime(row['Session4DateUtc'])
        elif row['EventFormat'] == 'sprint':
            print("Detected 'sprint' event format, treating as 'Sprint Shootout'")
            round_info['EventFormat'] = "Sprint Shootout"
            round_info['FP1'] = safe_session(row['Session1'])
            round_info['FP1DateUtc'] = safe_datetime(row['Session1DateUtc'])
            round_info['Quali'] = safe_session(row['Session2'])
            round_info['QualiDateUtc'] = safe_datetime(row['Session2DateUtc'])
            round_info['FP2'] = safe_session(row['Session3'])
            round_info['FP2DateUtc'] = safe_datetime(row['Session3DateUtc'])
            round_info['Sprint'] = safe_session(row['Session4'])
            round_info['SprintDateUtc'] = safe_datetime(row['Session4DateUtc'])
            print(round_info)
        round_info['GP'] = safe_session(row['Session5'])
        round_info['GPDateUtc'] = safe_datetime(row['Session5DateUtc'])
        schedule_dict.append(round_info)

    if not schedule_dict:
        raise ValueError(f"No schedule data found for year {year}")
    return SeasonSchedule(rounds=schedule_dict, year=year)
