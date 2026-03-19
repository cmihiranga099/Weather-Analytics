import type { CityWeather } from '../types/weather';

interface CityCardProps {
  city: CityWeather;
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
  if (score >= 40) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

function getRankBadge(rank: number): string {
  if (rank === 1) return 'bg-yellow-400 text-yellow-900';
  if (rank === 2) return 'bg-gray-300 text-gray-800';
  if (rank === 3) return 'bg-amber-600 text-white';
  return 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
}

export default function CityCard({ city }: CityCardProps) {
  const iconUrl = `https://openweathermap.org/img/wn/${city.weather.icon}@2x.png`;
  const isGoodComfort = city.comfort_score >= 80;

  return (
    <div className="glass rounded-[32px] p-7 card-hover group border-2 border-slate-200/80 dark:border-slate-600/50 animate-slide-up shadow-2xl">
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">
              {city.city_name}
            </h3>
            {isGoodComfort && (
              <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            )}
          </div>
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
            {city.country}
          </span>
        </div>
        <div className={`flex items-center justify-center w-10 h-10 rounded-2xl text-sm font-black shadow-inner ${getRankBadge(city.rank)}`}>
          #{city.rank}
        </div>
      </div>

      <div className="flex items-center justify-between mb-8 bg-white/40 dark:bg-slate-800/30 rounded-2xl p-4 border border-white/20 dark:border-slate-700/20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative group-hover:scale-110 transition-transform duration-300">
             <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
             <img src={iconUrl} alt={city.weather.description} className="relative w-16 h-16 pointer-events-none" />
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
              {city.temperature.current}°<span className="text-blue-500">c</span>
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {city.weather.description}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-3xl font-black ${getScoreColor(city.comfort_score)}`}>
            {city.comfort_score}
          </div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Comfort
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-end px-1">
            <span className="text-[9px] font-black underline decoration-primary-500/30 underline-offset-4 text-slate-500 uppercase tracking-widest">Comfort Status</span>
            <span className="text-[10px] font-black text-slate-400">{city.comfort_score}%</span>
          </div>
          <div className="relative h-3 w-full bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden border border-slate-300/30 dark:border-slate-600/30">
            <div
              className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_currentColor] animate-pulse-slow ${getScoreColor(city.comfort_score).replace('text-', 'bg-')}`}
              style={{ width: `${city.comfort_score}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Atmosphere</p>
            <div className="flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
               <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{city.humidity}% Humidity</p>
            </div>
            <div className="flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
               <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{city.pressure} hPa</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Dynamics</p>
            <div className="flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
               <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{city.temperature.feels_like}° Feels</p>
            </div>
            <div className="flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
               <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{city.wind_speed} m/s Wind</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
