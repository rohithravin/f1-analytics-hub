// src/api/f1Service.ts
import axios from "axios";

// Base URL of your FastAPI backend
const BASE_URL = "http://127.0.0.1:8000";

/**
 * Calls the FastAPI /process/mathadd endpoint.
 * @param x - first number
 * @param y - second number
 * @returns object with { result: number }
 */
export const mathAdd = async (x: number, y: number) => {
  try {
    const response = await axios.post(`${BASE_URL}/process/mathadd`, { x, y });
    return response.data; // { result: 300 } for example
  } catch (err) {
    console.error("API error:", err);
    throw err;
  }
};

/**
 * Fetches the F1 schedule for a given year.
 * @param year - the year to get the schedule for
 * @returns the F1 schedule data for the specified year
 */
export const getSchedule = async (year: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/schedule/${year}`);
    return response.data;
  } catch (err) {
    console.error("API error:", err);
    throw err;
  }
};