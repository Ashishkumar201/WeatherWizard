import type { Express } from "express";
import { createServer, type Server } from "http";
import axios from "axios";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || process.env.VITE_OPENWEATHER_API_KEY || '';

if (!OPENWEATHER_API_KEY) {
  console.warn('OpenWeather API key not found. Set OPENWEATHER_API_KEY environment variable for production use.');
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Weather API endpoint
  app.get('/api/weather/:city', async (req, res) => {
    try {
      const city = req.params.city;

      // First, get geocoding information
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${OPENWEATHER_API_KEY}`
      );

      if (!geoResponse.data || geoResponse.data.length === 0) {
        return res.status(404).json({ message: 'City not found. Please check the spelling and try again.' });
      }

      const { lat, lon, name, country } = geoResponse.data[0];

      // Then, get weather data using the coordinates
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${OPENWEATHER_API_KEY}`
      );

      // Combine the data
      const data = {
        ...weatherResponse.data,
        city: {
          name,
          country,
          lat,
          lon
        }
      };

      res.json(data);
    } catch (error) {
      console.error('Weather API error:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        return res.status(error.response.status).json({ 
          message: error.response.data.message || 'Failed to fetch weather data' 
        });
      }
      
      res.status(500).json({ message: 'An error occurred while fetching weather data' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
