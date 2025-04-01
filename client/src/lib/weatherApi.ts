import axios from 'axios';

// API base URL
const API_BASE_URL = '/api/weather';

// Function to fetch weather data for a city
export const fetchWeatherData = async (city: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${encodeURIComponent(city)}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch weather data');
    }
    throw new Error('Network error while fetching weather data');
  }
};
