import React from 'react';

interface Insight {
  type: 'alert' | 'warning' | 'info' | 'trend';
  icon: string;
  message: string;
}

interface InsightsPanelProps {
  insights: Insight[];
  loading: boolean;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ insights, loading }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="space-y-3">
          <div className="h-10 bg-gray-100 dark:bg-gray-700/50 rounded" />
          <div className="h-10 bg-gray-100 dark:bg-gray-700/50 rounded" />
        </div>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-blue-500">✨</span> Smart Insights
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No specific alerts or recommendations for now. The weather looks stable!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="text-blue-500">✨</span> Smart Insights
      </h3>
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-3 rounded-xl border ${
              insight.type === 'alert'
                ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400'
                : insight.type === 'warning'
                ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30 text-amber-700 dark:text-amber-400'
                : insight.type === 'trend'
                ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 text-blue-700 dark:text-blue-400'
                : 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-400'
            }`}
          >
            <span className="text-xl">{insight.icon}</span>
            <p className="text-sm font-medium leading-tight">{insight.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsPanel;
