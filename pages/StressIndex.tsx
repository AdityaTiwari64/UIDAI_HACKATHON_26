
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, PieChart, Pie } from 'recharts';
import {
  fetchLocationPrediction,
  fetchMetadata,
  fetchHistory,
  checkBackendHealth,
  getStressLevel,
  type RiskPrediction,
  type MetadataResponse,
  type HistoryRecord
} from '../services/apiService';

const StressIndex: React.FC = () => {
  const [overallStress, setOverallStress] = useState(0);
  const [prediction, setPrediction] = useState<RiskPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [targetStress, setTargetStress] = useState(50);

  // Metadata for dropdowns
  const [metadata, setMetadata] = useState<MetadataResponse | null>(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true);

  // Location selection state
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

  // Historical data for time series chart
  const [historyData, setHistoryData] = useState<HistoryRecord[]>([]);

  // Check backend health on mount
  useEffect(() => {
    const checkHealth = async () => {
      const health = await checkBackendHealth();
      setBackendStatus(health.model_loaded ? 'connected' : 'disconnected');
    };
    checkHealth();
  }, []);

  // Fetch metadata on component mount
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const data = await fetchMetadata();
        setMetadata(data);

        // Set defaults
        if (data.states.length > 0) {
          setSelectedState(data.states[0]);
          const districts = data.districts_by_state[data.states[0]] || [];
          setAvailableDistricts(districts);
          if (districts.length > 0) {
            setSelectedDistrict(districts[0]);
          }
        }
      } catch (error) {
        console.error('Error loading metadata:', error);
      } finally {
        setIsLoadingMetadata(false);
      }
    };
    loadMetadata();
  }, []);

  // Update districts when state changes
  useEffect(() => {
    if (metadata && selectedState) {
      const districts = metadata.districts_by_state[selectedState] || [];
      setAvailableDistricts(districts);
      if (districts.length > 0 && !districts.includes(selectedDistrict)) {
        setSelectedDistrict(districts[0]);
      }
    }
  }, [selectedState, metadata]);

  // Fetch prediction when state/district changes
  useEffect(() => {
    const fetchPrediction = async () => {
      if (!selectedState || !selectedDistrict || backendStatus !== 'connected') return;

      setIsLoading(true);
      try {
        // Use 2026-01 as current month (matching Forecasting page)
        const currentMonth = '2026-01';
        const result = await fetchLocationPrediction({
          state: selectedState,
          district: selectedDistrict,
          month: currentMonth
        });
        setPrediction(result);
        setTargetStress(Math.round(result.asi));

        // Also fetch history for the time series chart
        const historyResult = await fetchHistory(selectedState, selectedDistrict);
        setHistoryData(historyResult.history);
      } catch (error) {
        console.error('Failed to fetch prediction:', error);
        setTargetStress(50);
      }
      setIsLoading(false);
    };

    if (selectedState && selectedDistrict && backendStatus === 'connected') {
      fetchPrediction();
    }
  }, [selectedState, selectedDistrict, backendStatus, metadata]);

  // Animate the stress index to target value
  useEffect(() => {
    let current = overallStress;
    const interval = setInterval(() => {
      if (current < targetStress) {
        current += 2;
        if (current >= targetStress) {
          setOverallStress(targetStress);
          clearInterval(interval);
        } else {
          setOverallStress(current);
        }
      } else if (current > targetStress) {
        current -= 2;
        if (current <= targetStress) {
          setOverallStress(targetStress);
          clearInterval(interval);
        } else {
          setOverallStress(current);
        }
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [targetStress]);

  const handleRefresh = async () => {
    if (!selectedState || !selectedDistrict) return;

    setIsLoading(true);
    try {
      // Use 2026-01 as current month (matching Forecasting page)
      const currentMonth = '2026-01';
      const result = await fetchLocationPrediction({
        state: selectedState,
        district: selectedDistrict,
        month: currentMonth
      });
      setPrediction(result);
      setTargetStress(Math.round(result.asi));

      const historyResult = await fetchHistory(selectedState, selectedDistrict);
      setHistoryData(historyResult.history);
    } catch (error) {
      console.error('Failed to refresh prediction:', error);
    }
    setIsLoading(false);
  };

  const getStressColor = (value: number) => {
    if (value >= 75) return 'text-red-500';
    if (value >= 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStressLabel = (value: number) => {
    if (value >= 75) return 'High Risk';
    if (value >= 50) return 'Elevated';
    if (value >= 30) return 'Moderate';
    return 'Low';
  };

  // Prepare health data based on AERS
  const healthData = [
    { name: 'Healthy', value: prediction ? Math.round((1 - prediction.aers) * 847) : 847, color: '#22c55e' },
    { name: 'Warning', value: prediction ? Math.round(prediction.aers * 200) : 123, color: '#eab308' },
    { name: 'Critical', value: prediction ? Math.round(prediction.aers * 50) : 30, color: '#ef4444' },
  ];

  // Regional stress data based on prediction
  const stressData = [
    { region: 'Enrollment', cpu: prediction?.extracted_features ? Math.abs(prediction.extracted_features.d_e * 100 + 50) : 78, memory: 65, network: 82 },
    { region: 'Demographic', cpu: prediction?.extracted_features ? Math.abs(prediction.extracted_features.d_d * 100 + 50) : 62, memory: 58, network: 71 },
    { region: 'Child Updates', cpu: prediction?.extracted_features ? Math.abs(prediction.extracted_features.d_c * 100 + 50) : 85, memory: 72, network: 68 },
    { region: 'Biometric', cpu: prediction?.mbu ? prediction.mbu * 100 : 71, memory: 61, network: 76 },
    { region: 'Combined', cpu: prediction?.asi || 78, memory: prediction?.aers ? prediction.aers * 100 : 88, network: prediction?.rp ? Math.abs(prediction.rp * 50) : 72 },
  ];

  // Format history data for time series chart
  const timeSeriesChartData = historyData.map(record => ({
    time: record.month,
    load: record.asi,
    aers: record.aers * 100
  }));

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-[#0f1522]">
      {/* Header Section */}
      <div className="mb-6 bg-gradient-to-r from-primary to-blue-800 rounded-xl shadow-lg p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">System Stress Index Analysis</h2>
            <p className="text-blue-200">Real-time infrastructure health monitoring across all UIDAI data centers</p>
            {/* Backend Connection Status */}
            <div className="flex items-center gap-2 mt-2">
              <span className={`w-2 h-2 rounded-full ${backendStatus === 'connected' ? 'bg-green-400 animate-pulse' :
                backendStatus === 'checking' ? 'bg-yellow-400 animate-pulse' :
                  'bg-red-400'
                }`}></span>
              <span className="text-xs text-blue-200">
                ML Model: {backendStatus === 'connected' ? 'Connected' : backendStatus === 'checking' ? 'Checking...' : 'Disconnected'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* State Dropdown */}
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              disabled={isLoadingMetadata}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm text-sm"
            >
              <option value="" className="text-gray-800">Select State</option>
              {metadata?.states.map((state) => (
                <option key={state} value={state} className="text-gray-800">{state}</option>
              ))}
            </select>

            {/* District Dropdown */}
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={isLoadingMetadata || !selectedState}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm text-sm"
            >
              <option value="" className="text-gray-800">Select District</option>
              {availableDistricts.map((district) => (
                <option key={district} value={district} className="text-gray-800">{district}</option>
              ))}
            </select>

            <button
              onClick={handleRefresh}
              disabled={isLoading || backendStatus !== 'connected' || !selectedDistrict}
              className={`px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 transition-colors ${isLoading ? 'opacity-50' : ''}`}
            >
              <span className={`material-symbols-outlined ${isLoading ? 'animate-spin' : ''}`}>refresh</span>
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Location Banner */}
        {selectedState && selectedDistrict && (
          <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-3">
            <span className="material-symbols-outlined text-blue-200">location_on</span>
            <span className="text-sm">
              <span className="font-semibold">{selectedState}</span> → <span className="font-semibold">{selectedDistrict}</span>
              {prediction?.location?.month && <span className="text-blue-200 ml-2">({prediction.location.month})</span>}
            </span>
          </div>
        )}
      </div>

      {/* Main Stress Indicator */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-1 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">Overall Stress Index</h3>
            {prediction && (
              <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">ML</span>
            )}
          </div>
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
          <span className={`mt-4 px-3 py-1 rounded-full text-sm font-semibold ${overallStress >= 90 ? 'bg-red-100 text-red-700' :
            overallStress >= 75 ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
            {getStressLabel(overallStress)}
          </span>

          {/* Additional ML Metrics */}
          {prediction && (
            <div className="mt-4 w-full space-y-2 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">AERS (Risk)</span>
                <span className={`font-bold ${prediction.aers > 0.7 ? 'text-red-500' : prediction.aers > 0.3 ? 'text-yellow-500' : 'text-green-500'}`}>
                  {(prediction.aers * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">MBU Ratio</span>
                <span className="font-bold text-blue-500">{(prediction.mbu * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Risk Prop.</span>
                <span className="font-bold text-purple-500">{prediction.rp ? (prediction.rp * 100).toFixed(1) : 0}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Component Stats */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'ASI Score', value: prediction ? `${prediction.asi.toFixed(1)}` : '--', icon: 'speed', trend: prediction ? (prediction.asi > 70 ? '+high' : '-low') : '', color: 'blue' },
            { label: 'AERS Risk', value: prediction ? `${(prediction.aers * 100).toFixed(1)}%` : '--', icon: 'warning', trend: prediction ? (prediction.aers > 0.5 ? '+high' : '-low') : '', color: 'orange' },
            { label: 'MBU Ratio', value: prediction ? `${(prediction.mbu * 100).toFixed(1)}%` : '--', icon: 'child_care', trend: '', color: 'purple' },
            { label: 'ML Score', value: prediction ? `${prediction.ml_prediction?.toFixed(3) || 'N/A'}` : '--', icon: 'psychology', trend: '', color: 'green' },
          ].map((stat, i) => (
            <div key={i} className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className={`p-2 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </span>
                {stat.trend && (
                  <span className={`text-xs font-medium ${stat.trend.startsWith('+') ? 'text-red-500' : 'text-green-500'}`}>
                    {stat.trend}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Feature Stress Comparison */}
        <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">bar_chart</span>
              Feature Stress Comparison
            </h3>
            <div className="flex gap-2 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500"></span> Stress</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-500"></span> Load</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-500"></span> Usage</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stressData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
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
            Risk Distribution
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
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                  {item.name}
                </div>
                <p className="text-lg font-bold text-gray-800 dark:text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time Series Chart - Historical Trend */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">timeline</span>
            Historical ASI Trend
            {historyData.length > 0 && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium ml-2">
                {historyData.length} records
              </span>
            )}
          </h3>
          <div className="flex gap-2 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary"></span> ASI</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-500"></span> AERS %</span>
          </div>
        </div>
        <div className="h-64">
          {timeSeriesChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="load" stroke="#1c3d6e" strokeWidth={3} dot={{ r: 4, fill: '#1c3d6e' }} activeDot={{ r: 6 }} name="ASI" />
                <Line type="monotone" dataKey="aers" stroke="#f97316" strokeWidth={2} dot={{ r: 3, fill: '#f97316' }} name="AERS %" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <span className="material-symbols-outlined text-4xl mb-2">timeline</span>
                <p>Select a location to view historical trends</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alerts Section */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">notifications_active</span>
          Active Alerts
          {prediction && prediction.aers > 0.5 && (
            <span className="ml-2 px-2 py-0.5 text-[10px] bg-red-100 text-red-700 rounded-full font-bold">ML Risk Alert</span>
          )}
        </h3>
        <div className="space-y-4">
          {prediction && prediction.aers > 0.5 && (
            <div className="p-4 rounded-lg border-l-4 bg-purple-50 border-purple-500">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-purple-500">smart_toy</span>
                  <div>
                    <p className="text-sm text-gray-800 font-medium">ML Model Alert: High exclusion risk detected (AERS: {(prediction.aers * 100).toFixed(1)}%)</p>
                    <p className="text-xs text-gray-500 mt-1">Just now - {selectedState} → {selectedDistrict}</p>
                  </div>
                </div>
                <button className="text-xs text-primary font-medium hover:underline">Investigate</button>
              </div>
            </div>
          )}
          {prediction && prediction.asi > 75 && (
            <div className="p-4 rounded-lg border-l-4 bg-yellow-50 border-yellow-500">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-yellow-600">warning</span>
                  <div>
                    <p className="text-sm text-gray-800 font-medium">Elevated stress level detected (ASI: {prediction.asi.toFixed(1)})</p>
                    <p className="text-xs text-gray-500 mt-1">Just now - {selectedDistrict}</p>
                  </div>
                </div>
                <button className="text-xs text-primary font-medium hover:underline">Acknowledge</button>
              </div>
            </div>
          )}
          {[
            { severity: 'info', message: `Data updated for ${selectedDistrict || 'selected district'}`, time: 'Just now' },
          ].map((alert, i) => (
            <div key={i} className={`p-4 rounded-lg border-l-4 bg-blue-50 border-blue-500`}>
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-blue-500">info</span>
                  <div>
                    <p className="text-sm text-gray-800 font-medium">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
                <button className="text-xs text-primary font-medium hover:underline">Dismiss</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StressIndex;
