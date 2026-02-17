import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { CityWeather } from '../types/weather';

interface WeatherChartProps {
  data: CityWeather[];
}

export default function WeatherChart({ data }: WeatherChartProps) {
  const chartData = data.map(city => ({
    name: city.city_name,
    temperature: city.temperature.current,
    comfort: city.comfort_score,
    humidity: city.humidity,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        City Comparison
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '8px',
              color: '#F9FAFB',
            }}
          />
          <Legend />
          <Bar dataKey="temperature" fill="#3B82F6" name="Temperature (°C)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="comfort" fill="#10B981" name="Comfort Score" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
