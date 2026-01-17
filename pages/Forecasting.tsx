
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import { generateAIInsights, runSmartForecast } from '../services/geminiService';

const initialData = [
  { name: 'Oct 18', actual: 60, predicted: 55, low: 50, high: 60 },
  { name: 'Oct 19', actual: 55, predicted: 58, low: 53, high: 63 },
  { name: 'Oct 20', actual: 65, predicted: 60, low: 55, high: 65 },
  { name: 'Oct 21', actual: 40, predicted: 45, low: 40, high: 50 },
  { name: 'Oct 22', actual: 45, predicted: 48, low: 43, high: 53 },
  { name: 'Oct 23', actual: 35, predicted: 40, low: 35, high: 45 },
  { name: 'Oct 24', actual: 45, predicted: 50, low: 45, high: 55 },
];

const Forecasting: React.FC = () => {
  const [data, setData] = useState(initialData);
  const [insights, setInsights] = useState("Analyzing system metrics for fresh insights...");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      const res = await generateAIInsights("Traffic volume spikes predicted for next week due to holiday alignment. Mean error 1.2%. Prediction accuracy 98.4%.");
      if (res) setInsights(res);
    };
    fetchInsights();
  }, []);

  const handleRunForecast = async () => {
    setIsUpdating(true);
    const result = await runSmartForecast("Ensemble V2", "All Regions", "7 Days");
    if (result && result.dataPoints) {
      const formatted = result.dataPoints.map((p: any) => ({
        name: p.day,
        actual: p.actual,
        predicted: p.predicted,
        low: p.confidenceLow,
        high: p.confidenceHigh
      }));
      setData(formatted);
      setInsights(result.summary || "Forecast updated successfully.");
    }
    setIsUpdating(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-[#0f1522]">
      <div className="mb-6 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Forecast Model Selection</label>
              <select className="w-full pl-3 pr-10 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-gray-700 dark:text-gray-200">
                <option value="ensemble_v2">Ensemble V2 (Prophet + LSTM)</option>
                <option value="arima">ARIMA Statistical</option>
                <option value="transformer">Transformer (Experimental)</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Region / Dataset</label>
              <select className="w-full pl-3 pr-10 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-gray-700 dark:text-gray-200">
                <option>All Regions (Aggregated)</option>
                <option>North Zone (Delhi)</option>
                <option>South Zone (Bangalore)</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Projection Horizon</label>
              <div className="flex bg-gray-50 dark:bg-gray-800 rounded-lg p-1 border border-gray-300 dark:border-gray-600">
                <button className="flex-1 py-1.5 text-xs font-medium rounded text-gray-600 dark:text-gray-400">24H</button>
                <button className="flex-1 py-1.5 text-xs font-medium rounded bg-white dark:bg-gray-700 text-primary dark:text-white shadow-sm ring-1 ring-gray-200">7 Days</button>
                <button className="flex-1 py-1.5 text-xs font-medium rounded text-gray-600 dark:text-gray-400">30 Days</button>
              </div>
            </div>
          </div>
          <button 
            onClick={handleRunForecast}
            disabled={isUpdating}
            className={`px-6 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg shadow-sm flex items-center gap-2 transition-colors ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="material-symbols-outlined text-lg">{isUpdating ? 'sync' : 'play_arrow'}</span>
            {isUpdating ? 'Running...' : 'Run Forecast'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Traffic Volume: Actual vs Predicted</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Historical throughput compared with AI model projections.</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-primary"></span>
                  <span className="text-gray-600">Actual</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-secondary"></span>
                  <span className="text-gray-600">Predicted</span>
                </div>
              </div>
            </div>

            <div className="h-80 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                  <Area dataKey="high" dataKey2="low" stroke="none" fill="#b48d3e" fillOpacity={0.1} />
                  <Line type="monotone" dataKey="actual" stroke="#1c3d6e" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                  <Line type="monotone" dataKey="predicted" stroke="#b48d3e" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="absolute top-0 right-0 p-2 text-[10px] text-gray-400 italic">Confidence Interval (95%)</div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-8">
              {[
                { label: 'Mean Error', val: '1.2%' },
                { label: 'Accuracy', val: '98.4%', color: 'text-green-600' },
                { label: 'Predicted Peak', val: '102M', color: 'text-secondary' },
                { label: 'Status', val: 'Active', active: true }
              ].map((item, i) => (
                <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">{item.label}</p>
                  {item.active ? (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-sm font-bold text-gray-800 dark:text-white">{item.val}</span>
                    </div>
                  ) : (
                    <p className={`text-lg font-bold ${item.color || 'text-gray-800 dark:text-white'} mt-1`}>{item.val}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600">
                <span className="material-symbols-outlined">lightbulb</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">AI Insights & Recs</h3>
                <p className="text-xs text-gray-500">Automated reasoning engine output.</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4">
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 rounded-r-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-orange-700 uppercase">Traffic Anomaly</span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-gray-200">Oct 26</span>
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug">Projected 15% surge in auth requests due to festive holiday alignment.</p>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-blue-700 uppercase">Capacity Planning</span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-gray-200">Immediate</span>
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug">Server load predicted to exceed 85% threshold. Scaling Shard #04 recommended.</p>
                <div className="mt-3 flex gap-2">
                  <button className="text-xs bg-primary text-white px-3 py-1.5 rounded font-medium shadow-sm">Auto-Scale</button>
                  <button className="text-xs bg-white text-gray-700 border border-gray-200 px-3 py-1.5 rounded font-medium">Ignore</button>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-300 rounded-r-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-600 uppercase">Model Health</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">{insights}</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button className="w-full py-2.5 flex items-center justify-center gap-2 text-sm text-primary dark:text-blue-400 font-semibold hover:bg-gray-50 rounded transition-colors">
                Generate Full Analysis
                <span className="material-symbols-outlined text-lg">download</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecasting;
