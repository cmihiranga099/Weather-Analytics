import type { SortField, SortDirection } from '../types/weather';

interface SortControlsProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField) => void;
  scoreFilter: [number, number];
  onFilterChange: (range: [number, number]) => void;
}

const sortOptions: { value: SortField; label: string }[] = [
  { value: 'rank', label: 'Rank' },
  { value: 'city_name', label: 'City Name' },
  { value: 'temperature', label: 'Temperature' },
  { value: 'comfort_score', label: 'Comfort Score' },
];

export default function SortControls({
  sortField,
  sortDirection,
  onSortChange,
  scoreFilter,
  onFilterChange,
}: SortControlsProps) {
  return (
    <div className="glass rounded-3xl p-5 flex flex-col lg:flex-row gap-6 items-start lg:items-center animate-slide-up border-white/20 dark:border-slate-800/50" style={{ animationDelay: '0.05s' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 whitespace-nowrap">Order By</span>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map(option => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 border ${
                sortField === option.value
                  ? 'bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-500/25 ring-2 ring-primary-500/20'
                  : 'bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                {option.label}
                {sortField === option.value && (
                  <span className="animate-in fade-in zoom-in duration-300">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:ml-auto">
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 whitespace-nowrap">Comfort Range</span>
           <span className="sm:hidden text-xs font-black text-primary-600 dark:text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded-lg">
             {scoreFilter[0]} - {scoreFilter[1]}%
           </span>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-64 bg-slate-100/50 dark:bg-slate-900/30 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
          <input
            type="range"
            min={0}
            max={100}
            value={scoreFilter[0]}
            onChange={e => onFilterChange([Number(e.target.value), scoreFilter[1]])}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600 hover:accent-primary-500 transition-all"
          />
          <span className="hidden sm:block text-[10px] font-black text-slate-400 px-2">TO</span>
          <input
            type="range"
            min={0}
            max={100}
            value={scoreFilter[1]}
            onChange={e => onFilterChange([scoreFilter[0], Number(e.target.value)])}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600 hover:accent-primary-500 transition-all"
          />
        </div>
        
        <span className="hidden sm:block text-sm font-black text-slate-700 dark:text-slate-300 min-w-[80px] text-right">
          {scoreFilter[0]} - {scoreFilter[1]}<span className="text-[10px] text-slate-400 ml-0.5">%</span>
        </span>
      </div>
    </div>
  );
}
