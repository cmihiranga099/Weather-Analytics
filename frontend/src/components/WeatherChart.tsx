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
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="comfortGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.15} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis 
            tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: '#f1f5f9', opacity: 0.1 }}
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '12px',
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
            }}
            itemStyle={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}
            labelStyle={{ color: '#fff', fontWeight: 900, marginBottom: '4px', fontSize: '12px' }}
          />
          <Bar 
            dataKey="temperature" 
            fill="url(#tempGradient)" 
            name="Temperature" 
            radius={[6, 6, 0, 0]} 
            barSize={24}
          />
          <Bar 
            dataKey="comfort" 
            fill="url(#comfortGradient)" 
            name="Comfort" 
            radius={[6, 6, 0, 0]} 
            barSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
