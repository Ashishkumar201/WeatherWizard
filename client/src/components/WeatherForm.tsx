import { useState, FormEvent } from 'react';

interface WeatherFormProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  errorMessage: string;
}

const WeatherForm = ({ searchQuery, onSearch, errorMessage }: WeatherFormProps) => {
  const [query, setQuery] = useState(searchQuery);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8 transition-all duration-300 hover:shadow-lg">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow">
          <label htmlFor="cityInput" className="sr-only">Enter city name</label>
          <input 
            type="text" 
            id="cityInput" 
            placeholder="Enter city name (e.g. New York, London, Tokyo)" 
            className={`w-full px-4 py-2 rounded-md border ${
              errorMessage ? 'border-error' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {errorMessage && (
            <p className="text-error text-sm mt-1">{errorMessage}</p>
          )}
        </div>
        <button 
          type="submit" 
          className="bg-primary text-white px-6 py-2 rounded-md shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-opacity-50 transition-colors duration-200"
        >
          <span className="flex items-center justify-center gap-2">
            <span className="material-icons text-sm">search</span>
            <span>Search</span>
          </span>
        </button>
      </form>
    </div>
  );
};

export default WeatherForm;
