
import React from 'react';
import { StatCardProps } from '../types';

const StatCard: React.FC<StatCardProps> = ({ label, value, trend, icon, trendUp, colorClass = "blue", isActionable }) => {
  const bgColorMap: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-300",
    purple: "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300",
    green: "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300",
    yellow: "bg-yellow-50 dark:bg-yellow-900/30 text-secondary dark:text-yellow-400",
  };

  return (
    <div className={`bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border ${isActionable ? 'border-l-4 border-secondary' : 'border-gray-100 dark:border-gray-700'} hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${bgColorMap[colorClass]}`}>
          <span className="material-icons-outlined">{icon}</span>
        </div>
      </div>
      {trend && (
        <div className={`flex items-center text-sm ${isActionable ? 'text-secondary' : trendUp ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
          <span className="material-icons-outlined text-base mr-1">{isActionable ? 'warning' : 'trending_up'}</span>
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
