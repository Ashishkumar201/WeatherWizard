import { DailyForecast } from '@/types/weather';
import { formatDay } from '@/utils/dateUtils';

interface ForecastProps {
  forecastData: DailyForecast[];
  temperatureUnit: 'celsius' | 'fahrenheit';
}

const Forecast = ({ forecastData, temperatureUnit }: ForecastProps) => {
  const convertTemperature = (temp: number): number => {
    if (temperatureUnit === 'fahrenheit') {
      return (temp * 9/5) + 32;
    }
    return temp;
  };

  const formatTemperature = (temp: number): string => {
    return `${Math.round(convertTemperature(temp))}°`;
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center gap-2">
        <span className="material-icons text-primary">date_range</span>
        <span>5-Day Forecast</span>
      </h3>
      
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <div className="min-w-max">
          <div className="grid grid-cols-5 divide-x">
            {forecastData.map((day, index) => (
              <div key={index} className="p-4 text-center transition-all duration-300 hover:bg-gray-50">
                <p className="font-medium text-gray-800 mb-2">{formatDay(day.dt)}</p>
                <img 
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                  className="w-10 h-10 mx-auto my-1"
                />
                <p className="text-sm">{day.weather[0].main}</p>
                <p className="mt-1">
                  <span className="font-medium">{formatTemperature(day.temp.max)}</span> 
                  <span className="text-gray-500 text-sm"> {formatTemperature(day.temp.min)}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecast;
