import type { Express } from "express";
import { createServer, type Server } from "http";
import axios from "axios";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || process.env.VITE_OPENWEATHER_API_KEY || '';

if (!OPENWEATHER_API_KEY) {
  console.warn('OpenWeather API key not found. Set OPENWEATHER_API_KEY environment variable for production use.');
}

// Function to process 3-hour forecast data into daily forecasts
function processForecastData(forecastList: any[]): any[] {
  const dailyData = new Map();
  
  // Group forecast data by day
  forecastList.forEach(forecast => {
    const date = new Date(forecast.dt * 1000);
    const day = date.toISOString().split('T')[0]; // Get YYYY-MM-DD as key
    
    if (!dailyData.has(day)) {
      dailyData.set(day, {
        temps: [],
        weather: [],
        dt: forecast.dt,
        humidity: [],
        pressure: [],
        wind_speed: [],
        pop: []
      });
    }
    
    const dayData = dailyData.get(day);
    dayData.temps.push(forecast.main.temp);
    dayData.weather.push(forecast.weather[0]);
    dayData.humidity.push(forecast.main.humidity);
    dayData.pressure.push(forecast.main.pressure);
    dayData.wind_speed.push(forecast.wind.speed);
    dayData.pop.push(forecast.pop || 0);
  });
  
  // Convert daily aggregates into the required format
  return Array.from(dailyData.values()).map(day => {
    // Find most common weather condition
    const weatherFrequency = day.weather.reduce((acc: any, curr: any) => {
      const id = curr.id;
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});
    
    const mostCommonWeatherId = Object.keys(weatherFrequency).reduce((a, b) => 
      weatherFrequency[a] > weatherFrequency[b] ? a : b
    );
    
    const mainWeather = day.weather.find((w: any) => w.id.toString() === mostCommonWeatherId);
    
    // Calculate min/max temps and averages
    const minTemp = Math.min(...day.temps);
    const maxTemp = Math.max(...day.temps);
    const avgTemp = day.temps.reduce((sum: number, temp: number) => sum + temp, 0) / day.temps.length;
    
    return {
      dt: day.dt,
      sunrise: 0, // Not available in standard forecast
      sunset: 0,  // Not available in standard forecast
      moonrise: 0,
      moonset: 0,
      moon_phase: 0,
      temp: {
        day: avgTemp,
        min: minTemp,
        max: maxTemp,
        night: minTemp, // approximation
        eve: avgTemp,   // approximation
        morn: avgTemp   // approximation
      },
      feels_like: {
        day: avgTemp,   // approximation
        night: minTemp, // approximation
        eve: avgTemp,   // approximation
        morn: avgTemp   // approximation
      },
      pressure: Math.round(day.pressure.reduce((sum: number, val: number) => sum + val, 0) / day.pressure.length),
      humidity: Math.round(day.humidity.reduce((sum: number, val: number) => sum + val, 0) / day.humidity.length),
      dew_point: 0,
      wind_speed: day.wind_speed.reduce((sum: number, val: number) => sum + val, 0) / day.wind_speed.length,
      wind_deg: 0,
      weather: [mainWeather],
      clouds: 0,
      pop: Math.max(...day.pop),
      uvi: 0
    };
  });
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

      // Then, get current weather data
      const currentWeatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );
      
      // And forecast data
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );
      
      // Process the forecast data to get daily forecasts
      const dailyForecasts = processForecastData(forecastResponse.data.list);
      
      // Construct a response that matches our WeatherData structure
      const data = {
        lat,
        lon,
        timezone: currentWeatherResponse.data.name,
        timezone_offset: 0,
        current: {
          dt: currentWeatherResponse.data.dt,
          sunrise: currentWeatherResponse.data.sys.sunrise,
          sunset: currentWeatherResponse.data.sys.sunset,
          temp: currentWeatherResponse.data.main.temp,
          feels_like: currentWeatherResponse.data.main.feels_like,
          pressure: currentWeatherResponse.data.main.pressure,
          humidity: currentWeatherResponse.data.main.humidity,
          dew_point: 0,
          uvi: 0,
          clouds: currentWeatherResponse.data.clouds.all,
          visibility: currentWeatherResponse.data.visibility,
          wind_speed: currentWeatherResponse.data.wind.speed,
          wind_deg: currentWeatherResponse.data.wind.deg,
          weather: currentWeatherResponse.data.weather
        },
        hourly: forecastResponse.data.list.slice(0, 24).map(item => ({
          dt: item.dt,
          temp: item.main.temp,
          feels_like: item.main.feels_like,
          pressure: item.main.pressure,
          humidity: item.main.humidity,
          dew_point: 0,
          uvi: 0,
          clouds: item.clouds.all,
          visibility: item.visibility || 10000,
          wind_speed: item.wind.speed,
          wind_deg: item.wind.deg,
          weather: item.weather,
          pop: item.pop || 0
        })),
        daily: dailyForecasts,
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
