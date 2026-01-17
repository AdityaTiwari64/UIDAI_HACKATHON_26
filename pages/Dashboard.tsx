
import React from 'react';
import StatCard from '../components/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Mon', value: 40 },
  { name: 'Tue', value: 55 },
  { name: 'Wed', value: 70 },
  { name: 'Thu', value: 85 },
  { name: 'Fri', value: 92 },
  { name: 'Sat', value: 60 },
  { name: 'Sun', value: 45 },
  { name: 'Mon', value: 30 },
];

const Dashboard: React.FC = () => {
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

            {/* Quick stats inline */}
            <div className="flex gap-6 mt-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">verified</span>
                <span className="text-white/80 text-sm">99.98% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">speed</span>
                <span className="text-white/80 text-sm">85M+ Daily Requests</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">security</span>
                <span className="text-white/80 text-sm">Enterprise Security</span>
              </div>
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
          <StatCard label="Total Enrolments" value="1.38 Billion" trend="+0.4% this month" icon="people" colorClass="blue" trendUp />
          <StatCard label="Auth Transactions" value="85.2 Million" trend="Daily Average" icon="verified_user" colorClass="purple" trendUp />
          <StatCard label="Server Uptime" value="99.98%" trend="Last 30 Days" icon="dns" colorClass="green" />
          <StatCard label="Pending Schedules" value="12" trend="Action Required" icon="pending_actions" colorClass="yellow" isActionable />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <span className="material-icons-outlined text-primary dark:text-blue-400">show_chart</span>
                System Stress Index Forecast
              </h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">Day</button>
                <button className="px-3 py-1 text-xs font-medium rounded-md bg-primary text-white">Week</button>
                <button className="px-3 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">Month</button>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.value > 90 ? '#b48d3e' : '#bfdbfe'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <span className="material-icons-outlined text-primary dark:text-blue-400">event</span>
              Upcoming Schedules
            </h3>
            <div className="space-y-6">
              {[
                { date: 'Oct 24', title: 'Database Maintenance', desc: 'Downtime: 02:00 - 04:00 IST', status: 'Pending', statusColor: 'yellow' },
                { date: 'Oct 26', title: 'Security Audit Report', desc: 'Regional Center North', status: 'Confirmed', statusColor: 'green' },
                { date: 'Oct 28', title: 'Model Retraining', desc: 'Forecasting Module V.2.1', status: '', statusColor: '' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex flex-col items-center min-w-[3rem]">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{item.date.split(' ')[0]}</span>
                    <span className="text-xl font-bold text-gray-800 dark:text-white">{item.date.split(' ')[1]}</span>
                  </div>
                  <div className={`flex-1 ${i < 2 ? 'pb-4 border-b border-gray-100 dark:border-gray-800' : ''}`}>
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
                    {item.status && (
                      <span className={`inline-block mt-2 px-2 py-0.5 bg-${item.statusColor}-100 dark:bg-${item.statusColor}-900/30 text-${item.statusColor}-800 dark:text-${item.statusColor}-200 text-[10px] font-bold rounded uppercase`}>
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 text-sm text-primary dark:text-blue-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors">
              View Full Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
