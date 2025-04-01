import { useState } from 'react';
import WeatherForm from './WeatherForm';
import WeatherDisplay from './WeatherDisplay';
import { WeatherData } from '@/types/weather';

const WeatherApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [temperatureUnit, setTemperatureUnit] = useState<'celsius' | 'fahrenheit'>('celsius');

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(`/api/weather/${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'City not found. Please check the spelling and try again.');
      }
      
      const data = await response.json();
      setWeatherData(data);
      setErrorMessage('');
    } catch (error) {
      setWeatherData(null);
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">WeatherNow</h1>
        <p className="text-gray-600">Real-time weather information at your fingertips</p>
      </header>

      <WeatherForm 
        searchQuery={searchQuery}
        onSearch={handleSearch}
        errorMessage={errorMessage}
      />

      <WeatherDisplay
        weatherData={weatherData}
        isLoading={isLoading}
        errorMessage={errorMessage}
        temperatureUnit={temperatureUnit}
        onTemperatureUnitChange={setTemperatureUnit}
      />

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>WeatherNow © {new Date().getFullYear()} | Data provided by OpenWeather API</p>
        <p className="mt-1">
          <button className="text-primary hover:underline mr-4">Privacy Policy</button>
          <button className="text-primary hover:underline">About</button>
        </p>
      </footer>
    </div>
  );
};

export default WeatherApp;
