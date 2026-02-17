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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map(option => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                sortField === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {option.label}
              {sortField === option.value && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:ml-auto">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Score: {scoreFilter[0]} - {scoreFilter[1]}
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={scoreFilter[0]}
          onChange={e => onFilterChange([Number(e.target.value), scoreFilter[1]])}
          className="w-20 accent-blue-600"
        />
        <input
          type="range"
          min={0}
          max={100}
          value={scoreFilter[1]}
          onChange={e => onFilterChange([scoreFilter[0], Number(e.target.value)])}
          className="w-20 accent-blue-600"
        />
      </div>
    </div>
  );
}
