
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart, AreaChart, BarChart, Bar, Cell } from 'recharts';
import { generateAIInsights } from '../services/geminiService';
import {
  fetchMetadata,
  fetchHistory,
  fetch3MonthForecast,
  getStressLevel,
  type RiskPrediction,
  type MetadataResponse,
  type HistoryRecord,
  type ForecastResponse,
  type MonthForecast
} from '../services/apiService';

type TabType = 'historical' | 'current' | 'future';

const Forecasting: React.FC = () => {
  const [insights, setInsights] = useState("Select a location to view predictions...");
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('current');

  // Metadata for dropdowns
  const [metadata, setMetadata] = useState<MetadataResponse | null>(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true);

  // Location-based Input State
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

  // Forecast data
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [predictionError, setPredictionError] = useState<string | null>(null);

  // Historical data (for historical tab)
  const [historyData, setHistoryData] = useState<HistoryRecord[]>([]);

  // Fetch metadata on component mount
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const data = await fetchMetadata();
        setMetadata(data);

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
        setPredictionError('Failed to load location data. Ensure backend is running.');
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

  useEffect(() => {
    const fetchInsights = async () => {
      const res = await generateAIInsights("Smart camp scheduling analysis with MBU projections.");
      if (res) setInsights(res);
    };
    fetchInsights();
  }, []);

  const handleRunForecast = async () => {
    if (!selectedState || !selectedDistrict) {
      setPredictionError('Please select a state and district.');
      return;
    }

    setIsUpdating(true);
    setPredictionError(null);

    try {
      // Fetch historical data (for historical tab)
      const historyResult = await fetchHistory(selectedState, selectedDistrict);
      // Filter to only show ≤2025-12
      const historicalOnly = historyResult.history.filter(h => h.month <= '2025-12');
      setHistoryData(historicalOnly);

      // Fetch 3-month forecast with new timeline
      const forecastResult = await fetch3MonthForecast(selectedState, selectedDistrict);
      setForecast(forecastResult);

      // Generate insights
      const stressLevel = getStressLevel(forecastResult.current.asi);
      setInsights(
        `Timeline Analysis:\n` +
        `• Historical Cutoff: ${forecastResult.timeline.historical_cutoff}\n` +
        `• Current (Active): ${forecastResult.timeline.current_month}\n` +
        `• Future Start: ${forecastResult.timeline.future_start}\n\n` +
        `MBU Projection Trends:\n` +
        `• Child (c): ${forecastResult.trends.c_trend > 0 ? '+' : ''}${forecastResult.trends.c_trend.toFixed(0)}/month\n` +
        `• Biometric (b): ${forecastResult.trends.b_trend > 0 ? '+' : ''}${forecastResult.trends.b_trend.toFixed(0)}/month\n` +
        `• Demographic (d): ${forecastResult.trends.d_trend > 0 ? '+' : ''}${forecastResult.trends.d_trend.toFixed(0)}/month\n\n` +
        `3-Month Forecast:\n` +
        `• Feb: MBU ${(forecastResult.month1.mbu * 100).toFixed(1)}%\n` +
        `• Mar: MBU ${(forecastResult.month2.mbu * 100).toFixed(1)}%\n` +
        `• Apr: MBU ${(forecastResult.month3.mbu * 100).toFixed(1)}%`
      );

    } catch (error) {
      console.error('Forecast error:', error);
      setPredictionError(error instanceof Error ? error.message : 'Failed to get forecast');
      setInsights('Failed to connect to ML model. Ensure Flask backend is running.');
    }

    setIsUpdating(false);
  };

  // Prepare historical chart data (≤2025-12)
  const historicalChartData = historyData.map(record => ({
    name: record.month,
    asi: record.asi,
    aers: record.aers * 100,
    mbu: record.mbu * 100
  }));

  // Prepare future chart data (Feb-Apr 2026)
  const futureChartData = forecast ? [
    { name: forecast.month1.month, asi: forecast.month1.asi, aers: forecast.month1.aers * 100, mbu: forecast.month1.mbu * 100, b: forecast.month1.b, c: forecast.month1.c, d: forecast.month1.d },
    { name: forecast.month2.month, asi: forecast.month2.asi, aers: forecast.month2.aers * 100, mbu: forecast.month2.mbu * 100, b: forecast.month2.b, c: forecast.month2.c, d: forecast.month2.d },
    { name: forecast.month3.month, asi: forecast.month3.asi, aers: forecast.month3.aers * 100, mbu: forecast.month3.mbu * 100, b: forecast.month3.b, c: forecast.month3.c, d: forecast.month3.d }
  ] : [];

  const tabContent = {
    historical: (
      <div className="space-y-6">
        {/* Historical Header */}
        <div className="bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl p-4 text-white">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl">history</span>
            <div>
              <p className="text-sm font-medium opacity-80">Historical Data</p>
              <p className="text-lg font-bold">Records up to {forecast?.timeline.historical_cutoff || '2025-12'}</p>
            </div>
          </div>
        </div>

        {/* Historical Trend Chart */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">timeline</span>
              ASI & AERS Historical Trend
            </h3>
            {historyData.length > 0 && (
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full font-medium">
                {historyData.length} months (≤ 2025-12)
              </span>
            )}
          </div>
          <div className="h-72">
            {historicalChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={historicalChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} domain={[0, 100]} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="asi" stroke="#64748b" fill="#64748b" fillOpacity={0.1} strokeWidth={3} name="ASI" />
                  <Line type="monotone" dataKey="aers" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} name="AERS %" />
                  <Line type="monotone" dataKey="mbu" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="MBU %" />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <span className="material-symbols-outlined text-5xl mb-3">history</span>
                  <p className="text-lg font-medium">No historical data</p>
                  <p className="text-sm">Run a forecast to load records ≤ 2025-12</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Historical Table */}
        {historyData.length > 0 && (
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Historical Records (≤ Dec 2025)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-3 font-semibold">Month</th>
                    <th className="text-right py-2 px-3 font-semibold">ASI</th>
                    <th className="text-right py-2 px-3 font-semibold">AERS</th>
                    <th className="text-right py-2 px-3 font-semibold">MBU</th>
                    <th className="text-right py-2 px-3 font-semibold">B</th>
                    <th className="text-right py-2 px-3 font-semibold">C</th>
                    <th className="text-right py-2 px-3 font-semibold">D</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.slice(-6).map((r, i) => (
                    <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-2 px-3 font-medium">{r.month}</td>
                      <td className="text-right py-2 px-3">{r.asi.toFixed(1)}</td>
                      <td className="text-right py-2 px-3">{(r.aers * 100).toFixed(2)}%</td>
                      <td className="text-right py-2 px-3">{(r.mbu * 100).toFixed(2)}%</td>
                      <td className="text-right py-2 px-3 font-mono text-xs">{r.b.toLocaleString()}</td>
                      <td className="text-right py-2 px-3 font-mono text-xs">{r.c.toLocaleString()}</td>
                      <td className="text-right py-2 px-3 font-mono text-xs">{r.d.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    ),

    current: (
      <div className="space-y-6">
        {forecast ? (
          <>
            {/* Current Month Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-3xl">radio_button_checked</span>
                  <div>
                    <p className="text-sm font-medium opacity-80">Active Operational Month</p>
                    <p className="text-2xl font-bold">{forecast.current.month}</p>
                    <p className="text-sm opacity-80">{selectedState} → {selectedDistrict}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${forecast.current.is_actual ? 'bg-green-400 text-green-900' : 'bg-yellow-400 text-yellow-900'}`}>
                    {forecast.current.is_actual ? 'ACTUAL DATA' : 'PROJECTED'}
                  </span>
                </div>
              </div>
            </div>

            {/* Current Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-5 text-white">
                <p className="text-xs uppercase font-bold opacity-80">Stress Index (ASI)</p>
                <p className="text-3xl font-bold mt-1">{forecast.current.asi.toFixed(1)}</p>
                <p className="text-xs mt-2 opacity-80">{getStressLevel(forecast.current.asi)}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg p-5 text-white">
                <p className="text-xs uppercase font-bold opacity-80">Exclusion Risk</p>
                <p className="text-3xl font-bold mt-1">{(forecast.current.aers * 100).toFixed(2)}%</p>
                <p className="text-xs mt-2 opacity-80">AERS Score</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-5 text-white">
                <p className="text-xs uppercase font-bold opacity-80">Minor Biometric Usage</p>
                <p className="text-3xl font-bold mt-1">{(forecast.current.mbu * 100).toFixed(2)}%</p>
                <p className="text-xs mt-2 opacity-80">MBU = c / (b + d)</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-5 text-white">
                <p className="text-xs uppercase font-bold opacity-80">ML Prediction</p>
                <p className="text-3xl font-bold mt-1">{forecast.current.ml_prediction.toFixed(4)}</p>
                <p className="text-xs mt-2 opacity-80">Raw Model Output</p>
              </div>
            </div>

            {/* Workload Breakdown */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">database</span>
                Workload Breakdown (Jan 2026)
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <span className="material-symbols-outlined text-blue-600 text-3xl mb-2">fingerprint</span>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{forecast.current.b.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Biometric (B)</p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <span className="material-symbols-outlined text-purple-600 text-3xl mb-2">child_care</span>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{forecast.current.c.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Child (C)</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <span className="material-symbols-outlined text-green-600 text-3xl mb-2">person</span>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{forecast.current.d.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Demographic (D)</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">calendar_today</span>
            <p className="text-lg font-medium text-gray-500">No current data</p>
            <p className="text-sm text-gray-400 mt-1">Run a forecast to view Jan 2026 operational data</p>
          </div>
        )}
      </div>
    ),

    future: (
      <div className="space-y-6">
        {forecast ? (
          <>
            {/* Future Header */}
            <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl p-5 text-white">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl">trending_up</span>
                <div>
                  <p className="text-sm font-medium opacity-80">3-Month Future Projection</p>
                  <p className="text-xl font-bold">Feb - Apr 2026</p>
                  <p className="text-sm opacity-80">Independent MBU projections with b/c/d trending</p>
                </div>
              </div>
            </div>

            {/* Future Trend Chart */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">ssid_chart</span>
                ASI, AERS & MBU Projection (Feb-Apr 2026)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={futureChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="asi" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.2} strokeWidth={3} name="ASI" />
                    <Line type="monotone" dataKey="aers" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} name="AERS %" />
                    <Line type="monotone" dataKey="mbu" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} name="MBU %" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4 text-xs">
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-teal-500"></span> ASI</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-orange-500"></span> AERS %</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-purple-500"></span> MBU %</span>
              </div>
            </div>

            {/* Forecast Table with unique MBU */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">table_chart</span>
                3-Month Forecast Details (Unique MBU per Month)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-3 font-semibold">Period</th>
                      <th className="text-right py-3 px-3 font-semibold">ASI</th>
                      <th className="text-right py-3 px-3 font-semibold">AERS</th>
                      <th className="text-right py-3 px-3 font-semibold text-purple-600">MBU</th>
                      <th className="text-right py-3 px-3 font-semibold">B (Bio)</th>
                      <th className="text-right py-3 px-3 font-semibold">C (Child)</th>
                      <th className="text-right py-3 px-3 font-semibold">D (Demo)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[forecast.month1, forecast.month2, forecast.month3].map((m, i) => (
                      <tr key={i} className="border-b border-gray-100 dark:border-gray-800 bg-teal-50/30 dark:bg-teal-900/10">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-teal-100 text-teal-700">FORECAST</span>
                            <span className="font-medium">{m.month}</span>
                          </div>
                        </td>
                        <td className={`text-right py-3 px-3 font-bold ${m.asi > 75 ? 'text-red-500' : m.asi > 50 ? 'text-yellow-500' : 'text-green-500'}`}>
                          {m.asi.toFixed(1)}
                        </td>
                        <td className="text-right py-3 px-3">{(m.aers * 100).toFixed(2)}%</td>
                        <td className="text-right py-3 px-3 font-bold text-purple-600">{(m.mbu * 100).toFixed(2)}%</td>
                        <td className="text-right py-3 px-3 font-mono text-xs">{m.b.toLocaleString()}</td>
                        <td className="text-right py-3 px-3 font-mono text-xs">{m.c.toLocaleString()}</td>
                        <td className="text-right py-3 px-3 font-mono text-xs">{m.d.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-4 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">info</span>
                MBU = c / (b + d) calculated independently for each month using trended b, c, d values
              </p>
            </div>

            {/* Trend Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-semibold text-blue-700 uppercase mb-2">Biometric Trend</h4>
                <p className={`text-2xl font-bold ${forecast.trends.b_trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {forecast.trends.b_trend >= 0 ? '+' : ''}{forecast.trends.b_trend.toFixed(0)}
                </p>
                <p className="text-xs text-gray-500">per month</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                <h4 className="text-sm font-semibold text-purple-700 uppercase mb-2">Child Biometric Trend</h4>
                <p className={`text-2xl font-bold ${forecast.trends.c_trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {forecast.trends.c_trend >= 0 ? '+' : ''}{forecast.trends.c_trend.toFixed(0)}
                </p>
                <p className="text-xs text-gray-500">per month (affects MBU)</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                <h4 className="text-sm font-semibold text-green-700 uppercase mb-2">Demographic Trend</h4>
                <p className={`text-2xl font-bold ${forecast.trends.d_trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {forecast.trends.d_trend >= 0 ? '+' : ''}{forecast.trends.d_trend.toFixed(0)}
                </p>
                <p className="text-xs text-gray-500">per month</p>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">trending_up</span>
            <p className="text-lg font-medium text-gray-500">No future forecast</p>
            <p className="text-sm text-gray-400 mt-1">Run a forecast to generate Feb-Apr 2026 projections</p>
          </div>
        )}
      </div>
    )
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-[#0f1522]">
      {/* Location Selection & Controls */}
      <div className="mb-6 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
          <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600">
            <span className="material-symbols-outlined">smart_toy</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">ASM-SCSS: Smart Camp Scheduling</h3>
            <p className="text-xs text-gray-500">Timeline: Historical (≤Dec 2025) | Current (Jan 2026) | Future (Feb-Apr 2026)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-gray-500 uppercase">State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              disabled={isLoadingMetadata}
              className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
            >
              <option value="">Select State</option>
              {metadata?.states.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-gray-500 uppercase">District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={isLoadingMetadata || !selectedState}
              className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
            >
              <option value="">Select District</option>
              {availableDistricts.map((district) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-[10px] font-semibold text-gray-500 uppercase opacity-0">Action</label>
            <button
              onClick={handleRunForecast}
              disabled={isUpdating || isLoadingMetadata || !selectedState || !selectedDistrict}
              className={`px-6 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors ${(isUpdating || isLoadingMetadata) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="material-symbols-outlined text-lg">{isUpdating ? 'sync' : 'psychology'}</span>
              {isUpdating ? 'Generating Forecast...' : 'Run Timeline Analysis'}
            </button>
          </div>
        </div>

        {predictionError && (
          <div className="text-sm text-red-500 flex items-center gap-1 mt-2">
            <span className="material-symbols-outlined text-sm">error</span>
            {predictionError}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-2 flex gap-2">
        {[
          { id: 'historical' as TabType, label: 'Historical (≤2025-12)', icon: 'history', color: 'slate' },
          { id: 'current' as TabType, label: 'Current (Jan 2026)', icon: 'radio_button_checked', color: 'blue' },
          { id: 'future' as TabType, label: 'Future (Feb-Apr)', icon: 'trending_up', color: 'teal' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === tab.id
                ? 'bg-primary text-white shadow-md'
                : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {tabContent[activeTab]}
        </div>

        {/* Insights Panel */}
        <div className="lg:col-span-1">
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600">
                <span className="material-symbols-outlined">lightbulb</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">MBU Analysis</h3>
                <p className="text-xs text-gray-500">Independent b/c/d trending</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-300 rounded-r-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line font-mono text-xs">
                {insights}
              </div>
            </div>

            {forecast && (
              <div className="mt-4 space-y-2">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-xs font-semibold text-purple-700">MBU Formula</p>
                  <p className="text-xs text-gray-600 font-mono mt-1">MBU_t+n = c_trended / (b_trended + d_trended)</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecasting;
