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
