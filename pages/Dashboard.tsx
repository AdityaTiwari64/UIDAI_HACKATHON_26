
import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import {
  fetchMetadata,
  fetchStateAggregate,
  type MetadataResponse,
  type AggregateResponse
} from '../services/apiService';

const Dashboard: React.FC = () => {
  const [metadata, setMetadata] = useState<MetadataResponse | null>(null);
  const [selectedState, setSelectedState] = useState<string>('');
  const [aggregate, setAggregate] = useState<AggregateResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load metadata on mount
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const data = await fetchMetadata();
        setMetadata(data);
        if (data.states.length > 0) {
          setSelectedState(data.states[0]);
        }
      } catch (error) {
        console.error('Error loading metadata:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMetadata();
  }, []);

  // Load aggregate when state changes
  useEffect(() => {
    const loadAggregate = async () => {
      if (!selectedState) return;
      setIsLoading(true);
      try {
        const data = await fetchStateAggregate(selectedState);
        setAggregate(data);
      } catch (error) {
        console.error('Error loading aggregate:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (selectedState) {
      loadAggregate();
    }
  }, [selectedState]);

  // Transform aggregate data for chart
  const stressChartData = aggregate?.all_districts.slice(0, 8).map((d, i) => ({
    name: d.district.length > 8 ? d.district.substring(0, 8) + '...' : d.district,
    value: d.asi
  })) || [];

  // Workload composition data
  const workloadData = aggregate ? [
    { name: 'Biometric', value: aggregate.workload.biometric },
    { name: 'Child', value: aggregate.workload.child },
    { name: 'Demographic', value: aggregate.workload.demographic }
  ] : [];

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {/* Animated Geometric Header */}
      <div className="relative w-full h-64 flex-shrink-0 overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-700 to-indigo-900">
          {/* Animated geometric patterns */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(30deg, rgba(255,255,255,0.03) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.03) 87.5%, rgba(255,255,255,0.03)),
              linear-gradient(150deg, rgba(255,255,255,0.03) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.03) 87.5%, rgba(255,255,255,0.03)),
              linear-gradient(30deg, rgba(255,255,255,0.03) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.03) 87.5%, rgba(255,255,255,0.03)),
              linear-gradient(150deg, rgba(255,255,255,0.03) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.03) 87.5%, rgba(255,255,255,0.03)),
              linear-gradient(60deg, rgba(180,141,62,0.15) 25%, transparent 25.5%, transparent 75%, rgba(180,141,62,0.15) 75%, rgba(180,141,62,0.15)),
              linear-gradient(60deg, rgba(180,141,62,0.15) 25%, transparent 25.5%, transparent 75%, rgba(180,141,62,0.15) 75%, rgba(180,141,62,0.15))
            `,
            backgroundSize: '80px 140px',
            backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px'
          }}></div>

          {/* Floating orbs */}
          <div className="absolute top-10 right-20 w-32 h-32 bg-secondary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-40 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-20 right-60 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>

          {/* Diagonal lines */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex items-center px-8">
          <div className="max-w-2xl relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 text-white text-xs font-bold rounded-full mb-4 uppercase tracking-wider backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Official Portal • Live
            </span>
            <h2 className="text-4xl font-bold text-white mb-3 font-display drop-shadow-lg">UIDAI Data Management System</h2>
            <p className="text-blue-100 text-lg leading-relaxed">Centralized forecasting, stress analysis, and resource scheduling for national identity infrastructure.</p>

            {/* State Selector */}
            <div className="flex gap-6 mt-6 items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">location_on</span>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm backdrop-blur-sm"
                >
                  {metadata?.states.map((state) => (
                    <option key={state} value={state} className="text-gray-800">{state}</option>
                  ))}
                </select>
              </div>
              {aggregate && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">speed</span>
                    <span className="text-white/80 text-sm">ASI: {aggregate.average.asi.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">warning</span>
                    <span className="text-white/80 text-sm">AERS: {(aggregate.average.aers * 100).toFixed(1)}%</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right side decorative element */}
          <div className="hidden lg:block absolute right-8 top-1/2 transform -translate-y-1/2">
            <div className="relative">
              <div className="w-40 h-40 border-4 border-white/20 rounded-full flex items-center justify-center">
                <div className="w-28 h-28 border-2 border-secondary/40 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '20s' }}>
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-3xl">verified_user</span>
                  </div>
                </div>
              </div>
              {/* Orbiting dots */}
              <div className="absolute top-0 left-1/2 w-3 h-3 bg-secondary rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
              <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-white/60 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
              <div className="absolute top-1/2 left-0 w-2 h-2 bg-blue-300 rounded-full transform -translate-y-1/2 -translate-x-1/2"></div>
              <div className="absolute top-1/2 right-0 w-3 h-3 bg-secondary/60 rounded-full transform -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>


      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="State Average ASI"
            value={aggregate ? aggregate.average.asi.toFixed(1) : '--'}
            trend={aggregate ? `${aggregate.districts_count} districts` : 'Loading'}
            icon="speed"
            colorClass="blue"
            trendUp={aggregate ? aggregate.average.asi > 60 : false}
          />
          <StatCard
            label="Exclusion Risk (AERS)"
            value={aggregate ? `${(aggregate.average.aers * 100).toFixed(1)}%` : '--'}
            trend={aggregate?.average.aers > 0.5 ? 'High Risk' : 'Normal'}
            icon="warning"
            colorClass={aggregate?.average.aers > 0.5 ? 'yellow' : 'green'}
            trendUp={aggregate ? aggregate.average.aers > 0.3 : false}
          />
          <StatCard
            label="MBU Ratio"
            value={aggregate ? `${(aggregate.average.mbu * 100).toFixed(1)}%` : '--'}
            trend="Minor Biometric Usage"
            icon="child_care"
            colorClass="purple"
          />
          <StatCard
            label="Districts Analyzed"
            value={aggregate ? aggregate.districts_count.toString() : '--'}
            trend={aggregate?.month || 'Loading'}
            icon="location_city"
            colorClass="green"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <span className="material-icons-outlined text-primary dark:text-blue-400">show_chart</span>
                District Stress Index Comparison
                {isLoading && <span className="material-symbols-outlined animate-spin text-sm">sync</span>}
              </h3>
              <div className="text-xs text-gray-500">
                {aggregate?.month} • {selectedState}
              </div>
            </div>
            <div className="h-64">
              {stressChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stressChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} domain={[0, 100]} />
                    <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {stressChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.value > 75 ? '#ef4444' : entry.value > 50 ? '#eab308' : '#22c55e'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  Loading district data...
                </div>
              )}
            </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <span className="material-icons-outlined text-primary dark:text-blue-400">analytics</span>
              Top Risk Districts
            </h3>
            <div className="space-y-4">
              {aggregate?.top_districts.slice(0, 5).map((district, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${i === 0 ? 'bg-red-500' : i === 1 ? 'bg-orange-500' : i === 2 ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}>
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">{district.district}</p>
                      <p className="text-xs text-gray-500">AERS: {(district.aers * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${district.asi > 75 ? 'text-red-500' : district.asi > 50 ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                    {district.asi.toFixed(0)}
                  </div>
                </div>
              )) || (
                  <div className="text-center text-gray-400 py-8">Loading...</div>
                )}
            </div>
          </div>
        </div>

        {/* Workload Composition */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <span className="material-icons-outlined text-primary dark:text-blue-400">pie_chart</span>
            State Workload Composition
          </h3>
          <div className="grid grid-cols-3 gap-6">
            {workloadData.map((item, i) => (
              <div key={i} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${i === 0 ? 'bg-blue-100 text-blue-600' : i === 1 ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'
                  }`}>
                  <span className="material-symbols-outlined text-2xl">
                    {i === 0 ? 'fingerprint' : i === 1 ? 'child_care' : 'person'}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{item.value.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{item.name} Load</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
