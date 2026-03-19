import React from 'react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: string;
  cityName: string;
  period: string;
  onPeriodChange: (period: string) => void;
  isGenerating: boolean;
  cities: { code: string; name: string }[];
  selectedCityCode: string;
  onCityChange: (cityCode: string) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ 
  isOpen, 
  onClose, 
  report, 
  cityName, 
  period, 
  onPeriodChange,
  isGenerating,
  cities,
  selectedCityCode,
  onCityChange
}) => {
  if (!isOpen) return null;

  const periods = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'yearly', label: 'Yearly' },
  ];

  const downloadReport = () => {
    const element = document.createElement("a");
    const file = new Blob([report], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Weather_Report_${cityName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Weather Report: {cityName}
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex gap-2">
              {periods.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onPeriodChange(p.id)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                    period === p.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <select
                value={selectedCityCode}
                onChange={(e) => onCityChange(e.target.value)}
                className="w-full pl-3 pr-10 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 border-none rounded-full text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                {cities.map((city) => (
                  <option key={city.code} value={city.code}>
                    {city.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 font-mono text-sm">
          <div className={`whitespace-pre-wrap text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-800 transition-opacity ${isGenerating ? 'opacity-50' : 'opacity-100'}`}>
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 animate-pulse">Analyzing historical data...</p>
              </div>
            ) : (
              report || "No report data available."
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={downloadReport}
            className="px-6 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Markdown
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
