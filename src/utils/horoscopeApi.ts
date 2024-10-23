import axios from "axios";
import { ApiResponse } from "../types/api";

const HOROSCOPE_API_BASE_URL = "https://horoscope-api-phi.vercel.app/api";

/**
 * Gets a list of valid signs
 * @returns signs
 */
export const getZodiacSigns = async (): Promise<string[]> => {
  const response = await axios.get<ApiResponse<string[]>>(
    `${HOROSCOPE_API_BASE_URL}/signs`
  );
  return response.data.data ?? [];
};

/**
 * Returns the hour’s fortune of the given sign.
 * @param zodiacSign
 * @returns
 */
export const getFortune = async (zodiacSign: string): Promise<string> => {
  const response = await axios.get<ApiResponse<string>>(
    `${HOROSCOPE_API_BASE_URL}/fortune?sign=${zodiacSign}`
  );
  return response.data.data ?? "";
};
