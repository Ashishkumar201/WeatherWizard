import { WeatherData } from '@/types/weather';
import { formatDate, formatTime } from '@/utils/dateUtils';
import WeatherDetails from './WeatherDetails';
import Forecast from './Forecast';
import LoadingSpinner from './LoadingSpinner';

interface WeatherDisplayProps {
  weatherData: WeatherData | null;
  isLoading: boolean;
  errorMessage: string;
  temperatureUnit: 'celsius' | 'fahrenheit';
  onTemperatureUnitChange: (unit: 'celsius' | 'fahrenheit') => void;
}

const WeatherDisplay = ({ 
  weatherData, 
  isLoading, 
  errorMessage, 
  temperatureUnit,
  onTemperatureUnitChange
}: WeatherDisplayProps) => {
  const convertTemperature = (temp: number): number => {
    if (temperatureUnit === 'fahrenheit') {
      return (temp * 9/5) + 32;
    }
    return temp;
  };

  const formatTemperature = (temp: number): string => {
    return `${Math.round(convertTemperature(temp))}°`;
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <LoadingSpinner />
        <p className="text-gray-600 mt-4">Fetching weather data...</p>
      </div>
    );
  }

  if (errorMessage && !weatherData) {
    return (
      <div className="py-12 text-center animate-fade-in">
        <div className="material-icons text-6xl text-error mb-4">error_outline</div>
        <h2 className="text-xl font-medium text-gray-800 mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-600">{errorMessage}</p>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="material-icons text-8xl text-gray-300 mb-4">wb_sunny</div>
        <h2 className="text-xl text-gray-500">Search for a city to get weather information</h2>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      {/* Main Weather Card */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        {/* Primary Weather Info */}
        <div className="bg-white rounded-lg shadow-md p-6 flex-grow">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Weather Icon and Temperature */}
            <div className="text-center sm:text-left">
              <div className="relative">
                <img 
                  src={`https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@4x.png`} 
                  alt={weatherData.current.weather[0].description} 
                  width="120" 
                  height="120"
                  className="mx-auto sm:mx-0"
                />
                <span className="absolute bottom-0 right-0 bg-primary text-white text-xs font-medium px-2 py-1 rounded-full">
                  {weatherData.current.weather[0].main}
                </span>
              </div>
            </div>
            
            {/* City and Details */}
            <div className="flex-grow">
              <div className="flex flex-col items-center sm:items-start">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-gray-800">{weatherData.city.name}</h2>
                  <span className="text-sm bg-gray-100 px-2 py-0.5 rounded text-gray-600">{weatherData.city.country}</span>
                </div>
                <p className="text-gray-500 text-sm mb-3">{formatDate(weatherData.current.dt)}</p>
                
                <div className="flex items-center gap-2">
                  <span className="text-5xl font-light">{formatTemperature(weatherData.current.temp)}</span>
                  <div className="flex text-sm border rounded-full overflow-hidden">
                    <button 
                      className={`px-2 py-1 ${temperatureUnit === 'celsius' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
                      onClick={() => onTemperatureUnitChange('celsius')}
                    >
                      °C
                    </button>
                    <button 
                      className={`px-2 py-1 ${temperatureUnit === 'fahrenheit' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
                      onClick={() => onTemperatureUnitChange('fahrenheit')}
                    >
                      °F
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-500 mt-1">Feels like {formatTemperature(weatherData.current.feels_like)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Summary Card */}
        <div className="bg-white rounded-lg shadow-md p-6 w-full md:w-64">
          <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            <span className="material-icons text-primary">today</span>
            <span>Daily Summary</span>
          </h3>
          <div className="grid grid-cols-2 gap-y-4">
            <div className="col-span-2 border-b pb-3 mb-1">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">High / Low</p>
                <p className="font-medium">
                  {formatTemperature(weatherData.daily[0].temp.max)} / {formatTemperature(weatherData.daily[0].temp.min)}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Sunrise</span>
              <span className="font-medium">{formatTime(weatherData.current.sunrise)}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Sunset</span>
              <span className="font-medium">{formatTime(weatherData.current.sunset)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Details Cards */}
      <WeatherDetails weatherData={weatherData} />

      {/* Forecast Section */}
      <Forecast forecastData={weatherData.daily.slice(1, 6)} temperatureUnit={temperatureUnit} />
    </div>
  );
};

export default WeatherDisplay;
