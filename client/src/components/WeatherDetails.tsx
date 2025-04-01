import { WeatherData } from '@/types/weather';

interface WeatherDetailsProps {
  weatherData: WeatherData;
}

const WeatherDetails = ({ weatherData }: WeatherDetailsProps) => {
  // Convert visibility from meters to kilometers
  const visibilityInKm = (weatherData.current.visibility / 1000).toFixed(1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Wind Card */}
      <div className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg">
        <div className="bg-blue-50 p-3 rounded-full">
          <span className="material-icons text-primary">air</span>
        </div>
        <div>
          <h3 className="text-sm text-gray-500">Wind</h3>
          <p className="font-medium">{weatherData.current.wind_speed} m/s</p>
        </div>
      </div>

      {/* Humidity Card */}
      <div className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg">
        <div className="bg-blue-50 p-3 rounded-full">
          <span className="material-icons text-primary">water_drop</span>
        </div>
        <div>
          <h3 className="text-sm text-gray-500">Humidity</h3>
          <p className="font-medium">{weatherData.current.humidity}%</p>
        </div>
      </div>

      {/* Pressure Card */}
      <div className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg">
        <div className="bg-blue-50 p-3 rounded-full">
          <span className="material-icons text-primary">speed</span>
        </div>
        <div>
          <h3 className="text-sm text-gray-500">Pressure</h3>
          <p className="font-medium">{weatherData.current.pressure} hPa</p>
        </div>
      </div>

      {/* Visibility Card */}
      <div className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg">
        <div className="bg-blue-50 p-3 rounded-full">
          <span className="material-icons text-primary">visibility</span>
        </div>
        <div>
          <h3 className="text-sm text-gray-500">Visibility</h3>
          <p className="font-medium">{visibilityInKm} km</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;
