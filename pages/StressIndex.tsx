
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, PieChart, Pie } from 'recharts';

const stressData = [
  { region: 'North', cpu: 78, memory: 65, network: 82, storage: 45 },
  { region: 'South', cpu: 62, memory: 58, network: 71, storage: 52 },
  { region: 'East', cpu: 85, memory: 72, network: 68, storage: 48 },
  { region: 'West', cpu: 71, memory: 61, network: 76, storage: 55 },
  { region: 'Central', cpu: 92, memory: 88, network: 95, storage: 72 },
];

const timeSeriesData = [
  { time: '00:00', load: 45 },
  { time: '04:00', load: 32 },
  { time: '08:00', load: 68 },
  { time: '12:00', load: 85 },
  { time: '16:00', load: 92 },
  { time: '20:00', load: 78 },
  { time: '23:59', load: 55 },
];

const healthData = [
  { name: 'Healthy', value: 847, color: '#22c55e' },
  { name: 'Warning', value: 123, color: '#eab308' },
  { name: 'Critical', value: 30, color: '#ef4444' },
];

const StressIndex: React.FC = () => {
  const [overallStress, setOverallStress] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState('All Regions');

  useEffect(() => {
    // Animate the stress index on mount
    const target = 78;
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      if (current >= target) {
        setOverallStress(target);
        clearInterval(interval);
      } else {
        setOverallStress(current);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const getStressColor = (value: number) => {
    if (value >= 90) return 'text-red-500';
    if (value >= 75) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStressLabel = (value: number) => {
    if (value >= 90) return 'Critical';
    if (value >= 75) return 'Elevated';
    if (value >= 50) return 'Moderate';
    return 'Low';
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-[#0f1522]">
      {/* Header Section */}
      <div className="mb-6 bg-gradient-to-r from-primary to-blue-800 rounded-xl shadow-lg p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">System Stress Index Analysis</h2>
            <p className="text-blue-200">Real-time infrastructure health monitoring across all UIDAI data centers</p>
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm"
            >
              <option value="All Regions">All Regions</option>
              <option value="North">North Zone</option>
              <option value="South">South Zone</option>
              <option value="East">East Zone</option>
              <option value="West">West Zone</option>
              <option value="Central">Central HQ</option>
            </select>
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 transition-colors">
              <span className="material-symbols-outlined">refresh</span>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main Stress Indicator */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-1 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Overall Stress Index</h3>
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={overallStress >= 90 ? '#ef4444' : overallStress >= 75 ? '#eab308' : '#22c55e'}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${overallStress * 2.51} 251`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${getStressColor(overallStress)}`}>{overallStress}</span>
              <span className="text-sm text-gray-500">/ 100</span>
            </div>
          </div>
          <span className={`mt-4 px-3 py-1 rounded-full text-sm font-semibold ${
            overallStress >= 90 ? 'bg-red-100 text-red-700' : 
            overallStress >= 75 ? 'bg-yellow-100 text-yellow-700' : 
            'bg-green-100 text-green-700'
          }`}>
            {getStressLabel(overallStress)}
          </span>
        </div>

        {/* Component Stats */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'CPU Utilization', value: '78%', icon: 'memory', trend: '+5%', color: 'blue' },
            { label: 'Memory Usage', value: '65%', icon: 'storage', trend: '+2%', color: 'purple' },
            { label: 'Network Load', value: '82%', icon: 'router', trend: '+12%', color: 'orange' },
            { label: 'Disk I/O', value: '45%', icon: 'hard_drive', trend: '-3%', color: 'green' },
          ].map((stat, i) => (
            <div key={i} className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className={`p-2 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </span>
                <span className={`text-xs font-medium ${stat.trend.startsWith('+') ? 'text-red-500' : 'text-green-500'}`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Regional Stress Comparison */}
        <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">bar_chart</span>
              Regional Stress Comparison
            </h3>
            <div className="flex gap-2 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500"></span> CPU</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-500"></span> Memory</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-500"></span> Network</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stressData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} domain={[0, 100]} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="cpu" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="memory" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="network" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Server Health Distribution */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">donut_large</span>
            Server Health
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {healthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {healthData.map((item, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></span>
                  {item.name}
                </div>
                <p className="text-lg font-bold text-gray-800 dark:text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time Series Chart */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">timeline</span>
            24-Hour Load Pattern
          </h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs font-medium rounded-md bg-primary text-white">Today</button>
            <button className="px-3 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">Yesterday</button>
            <button className="px-3 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">Week</button>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} domain={[0, 100]} />
              <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
              <Line type="monotone" dataKey="load" stroke="#1c3d6e" strokeWidth={3} dot={{r: 4, fill: '#1c3d6e'}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">notifications_active</span>
          Active Alerts
        </h3>
        <div className="space-y-4">
          {[
            { severity: 'critical', message: 'Central HQ server cluster approaching 95% CPU utilization', time: '2 min ago' },
            { severity: 'warning', message: 'Memory usage spike detected in North Zone authentication servers', time: '15 min ago' },
            { severity: 'info', message: 'Scheduled maintenance window starting in 4 hours for East Zone', time: '1 hour ago' },
          ].map((alert, i) => (
            <div key={i} className={`p-4 rounded-lg border-l-4 ${
              alert.severity === 'critical' ? 'bg-red-50 border-red-500' :
              alert.severity === 'warning' ? 'bg-yellow-50 border-yellow-500' :
              'bg-blue-50 border-blue-500'
            }`}>
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <span className={`material-symbols-outlined ${
                    alert.severity === 'critical' ? 'text-red-500' :
                    alert.severity === 'warning' ? 'text-yellow-600' :
                    'text-blue-500'
                  }`}>
                    {alert.severity === 'critical' ? 'error' : alert.severity === 'warning' ? 'warning' : 'info'}
                  </span>
                  <div>
                    <p className="text-sm text-gray-800 font-medium">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
                <button className="text-xs text-primary font-medium hover:underline">Acknowledge</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StressIndex;
