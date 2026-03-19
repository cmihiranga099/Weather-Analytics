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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Comfort Index Dashboard
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {data.length} cities ranked by comfort level
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowChart(prev => !prev)}
            className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {showChart ? 'Hide Chart' : 'Show Chart'}
          </button>
          <button
            onClick={() => handleGenerateReport()}
            disabled={isGeneratingReport}
            className={`px-4 py-2 text-sm text-white rounded-lg transition-colors shadow-sm flex items-center gap-2 ${
              isGeneratingReport ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isGeneratingReport ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            {isGeneratingReport ? 'Generating...' : 'Generate Report'}
          </button>
          <button
            onClick={refetch}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {showChart && <WeatherChart data={data} />}
        </div>
        <div className="lg:col-span-1">
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
