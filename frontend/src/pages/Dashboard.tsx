import { useState, useEffect, useMemo } from 'react';
import { useWeatherData } from '../hooks/useWeatherData';
import CityCard from '../components/CityCard';
import WeatherChart from '../components/WeatherChart';
import SortControls from '../components/SortControls';
import InsightsPanel from '../components/InsightsPanel';
import ReportModal from '../components/ReportModal';
import type { SortField, SortDirection, CityWeather } from '../types/weather';

interface Insight {
  type: 'alert' | 'warning' | 'info' | 'trend';
  icon: string;
  message: string;
}

function sortData(data: CityWeather[], field: SortField, direction: SortDirection): CityWeather[] {
  const sorted = [...data].sort((a, b) => {
    let comparison = 0;
    switch (field) {
      case 'rank':
        comparison = a.rank - b.rank;
        break;
      case 'city_name':
        comparison = a.city_name.localeCompare(b.city_name);
        break;
      case 'temperature':
        comparison = a.temperature.current - b.temperature.current;
        break;
      case 'comfort_score':
        comparison = a.comfort_score - b.comfort_score;
        break;
    }
    return direction === 'asc' ? comparison : -comparison;
  });
  return sorted;
}

export default function Dashboard() {
  const { data, loading, error, refetch, fetchInsights, fetchReport } = useWeatherData();
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [scoreFilter, setScoreFilter] = useState<[number, number]>([0, 100]);
  const [showChart, setShowChart] = useState(true);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportPeriod, setReportPeriod] = useState('daily');
  const [selectedCityForReport, setSelectedCityForReport] = useState<{ code: string; name: string } | null>(null);

  // Fetch insights for the top city when data loads
  useEffect(() => {
    const getTopInsights = async () => {
      if (data.length > 0) {
        setInsightsLoading(true);
        const topCity = data[0];
        const result = await fetchInsights(topCity.city_code);
        setInsights(result);
        setInsightsLoading(false);
      }
    };
    getTopInsights();
  }, [data.length]);

  const handleGenerateReport = async (cityCode?: string, cityName?: string, period = 'daily') => {
    const code = cityCode || (data.length > 0 ? data[0].city_code : null);
    const name = cityName || (data.length > 0 ? data[0].city_name : '');

    if (code) {
      setIsGeneratingReport(true);
      setIsReportOpen(true);
      setReportPeriod(period);
      setSelectedCityForReport({ code, name });
      const result = await fetchReport(code, period);
      setReportContent(result);
      setIsGeneratingReport(false);
    }
  };

  const handlePeriodChange = (newPeriod: string) => {
    if (selectedCityForReport) {
      handleGenerateReport(selectedCityForReport.code, selectedCityForReport.name, newPeriod);
    }
  };

  const handleCityChange = (newCityCode: string) => {
    const city = data.find(c => c.city_code === newCityCode);
    if (city) {
      handleGenerateReport(city.city_code, city.city_name, reportPeriod);
    }
  };

  const cityOptions = useMemo(() => {
    return data.map(c => ({ code: c.city_code, name: c.city_name }));
  }, [data]);

  const handleSortChange = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection(field === 'rank' ? 'asc' : 'desc');
    }
  };

  const filteredAndSorted = useMemo(() => {
    const filtered = data.filter(
      city => city.comfort_score >= scoreFilter[0] && city.comfort_score <= scoreFilter[1]
    );
    return sortData(filtered, sortField, sortDirection);
  }, [data, sortField, sortDirection, scoreFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-md text-center">
          <p className="text-red-600 dark:text-red-400 font-medium mb-2">Error loading data</p>
          <p className="text-red-500 dark:text-red-300 text-sm mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 animate-slide-up">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-[10px] font-bold uppercase tracking-widest rounded-full mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            Live Analytics
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Comfort Index <span className="text-primary-600 dark:text-primary-400">Dashboard</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Real-time weather metrics across <span className="text-slate-900 dark:text-slate-200 font-bold">{data.length} cities</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowChart(prev => !prev)}
            className="px-5 py-2.5 text-sm font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-2"
          >
            {showChart ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 011.012-2.31M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.364-3.636l-1.414 1.414m-14.142 0l-1.414-1.414m12.728 0l1.414-1.414m-14.142 0l1.414 1.414" />
              </svg>
            )}
            {showChart ? 'Hide Visuals' : 'Show Visuals'}
          </button>
          
          <button
            onClick={() => handleGenerateReport()}
            disabled={isGeneratingReport}
            className="btn-primary flex items-center gap-2"
          >
            {isGeneratingReport ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            {isGeneratingReport ? 'Generating...' : 'Generate Insights'}
          </button>

          <button
            onClick={refetch}
            className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all border border-blue-100 dark:border-blue-800/50 shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <SortControls
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        scoreFilter={scoreFilter}
        onFilterChange={setScoreFilter}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {showChart && (
            <div className="glass rounded-[32px] p-7 transition-all duration-500 animate-slide-up border-2 border-slate-200/80 dark:border-slate-700/60">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Trend Distribution</h3>
                <span className="text-xs font-medium text-slate-500">Last 24 Hours</span>
              </div>
              <WeatherChart data={data} />
            </div>
          )}
        </div>
        <div className="lg:col-span-1 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <InsightsPanel insights={insights} loading={insightsLoading} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSorted.map((city: CityWeather) => (
          <CityCard 
            key={city.city_code} 
            city={city} 
          />
        ))}
      </div>

      {filteredAndSorted.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No cities match the current filter criteria.
          </p>
        </div>
      )}

      {data.length > 0 && (
        <ReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          report={reportContent}
          cityName={selectedCityForReport?.name || ''}
          period={reportPeriod}
          onPeriodChange={handlePeriodChange}
          isGenerating={isGeneratingReport}
          cities={cityOptions}
          selectedCityCode={selectedCityForReport?.code || ''}
          onCityChange={handleCityChange}
        />
      )}
    </div>
  );
}
