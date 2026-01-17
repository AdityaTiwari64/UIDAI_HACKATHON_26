
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
      <div className="relative w-full h-64 flex-shrink-0">
        <img alt="Gateway of India" className="w-full h-full object-cover opacity-60 mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNFtH3JzflZzz8f3Kz0GRGorQIxQMtadjtKuM2oLQ_dPDfAssrccQtKp63nDM6_ETKp8AjSAlQNv5vfAtJS9qCfx5kkUgb096nvVjrJK66jPh8s_CcAulx5SEeQMxPXILjym-ilU_QeLqgje4pe7n_kux5-JDXrZfYklSQ1yh7t7cyvCMvCTXmgVyCmaFMOU3LGLIYxMy6rPJVvbxXg-m_wL4TIPCKMQBE0mxmBuBfau5g59IU06MepG_iJDBAkdUsmPbl5n_UbhY" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent flex items-center px-8">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 bg-secondary/20 border border-secondary text-secondary text-xs font-bold rounded-full mb-3 uppercase tracking-wider backdrop-blur-sm">Official Portal</span>
            <h2 className="text-4xl font-bold text-white mb-2 font-display">UIDAI Data Management System</h2>
            <p className="text-blue-100 text-lg">Centralized forecasting, stress analysis, and resource scheduling for national identity infrastructure.</p>
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
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                  <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
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
