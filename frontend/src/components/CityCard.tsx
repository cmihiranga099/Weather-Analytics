import type { CityWeather } from '../types/weather';

interface CityCardProps {
  city: CityWeather;
  onViewReport: () => void;
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
  if (score >= 40) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

function getScoreBg(score: number): string {
  if (score >= 80) return 'bg-green-100 dark:bg-green-900/30';
  if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30';
  if (score >= 40) return 'bg-orange-100 dark:bg-orange-900/30';
  return 'bg-red-100 dark:bg-red-900/30';
}

function getRankBadge(rank: number): string {
  if (rank === 1) return 'bg-yellow-400 text-yellow-900';
  if (rank === 2) return 'bg-gray-300 text-gray-800';
  if (rank === 3) return 'bg-amber-600 text-white';
  return 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
}

export default function CityCard({ city, onViewReport }: CityCardProps) {
  const iconUrl = `https://openweathermap.org/img/wn/${city.weather.icon}@2x.png`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-100 dark:border-gray-700">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {city.city_name}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {city.country}
          </span>
        </div>
        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getRankBadge(city.rank)}`}>
          {city.rank}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <img src={iconUrl} alt={city.weather.description} className="w-12 h-12" />
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {city.temperature.current}°C
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
            {city.weather.description}
          </p>
        </div>
      </div>

      <div className={`rounded-lg p-3 mb-3 ${getScoreBg(city.comfort_score)}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Comfort Score
          </span>
          <span className={`text-2xl font-bold ${getScoreColor(city.comfort_score)}`}>
            {city.comfort_score}
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-current transition-all duration-500"
            style={{ width: `${city.comfort_score}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Feels like</span>
          <span className="font-medium">{city.temperature.feels_like}°C</span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Humidity</span>
          <span className="font-medium">{city.humidity}%</span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Wind</span>
          <span className="font-medium">{city.wind_speed} m/s</span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Pressure</span>
          <span className="font-medium">{city.pressure} hPa</span>
        </div>
      </div>

      <button
        onClick={onViewReport}
        className="mt-4 w-full py-2 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-lg transition-all border border-gray-100 dark:border-gray-700 flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        View Analytical Report
      </button>
    </div>
  );
}
