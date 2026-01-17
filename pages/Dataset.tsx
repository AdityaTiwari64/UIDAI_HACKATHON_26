
import React, { useState } from 'react';
import { DatasetRecord } from '../types';

const INITIAL_RECORDS: DatasetRecord[] = [
  { id: 'DS-2023-8842', name: 'Biometric Sync Logs', description: 'Daily sync from enrollment centers', type: 'Biometric', region: 'Northern Zone', lastUpdated: 'Oct 24, 2023 09:42 AM', status: 'Verified', icon: 'fingerprint', colorClass: 'blue' },
  { id: 'DS-2023-8845', name: 'Authentication Records', description: 'Failed auth attempts > 3', type: 'Auth Logs', region: 'Western Zone', lastUpdated: 'Oct 24, 2023 08:15 AM', status: 'Pending Review', icon: 'verified_user', colorClass: 'purple' },
  { id: 'DS-2023-8801', name: 'Demographic Updates', description: 'Address change requests batch #412', type: 'Demographic', region: 'Southern Zone', lastUpdated: 'Oct 23, 2023 11:30 PM', status: 'Verified', icon: 'badge', colorClass: 'blue' },
  { id: 'DS-2023-8799', name: 'Server Error Logs', description: 'Timeout exceptions on Node-4', type: 'System Logs', region: 'Central HQ', lastUpdated: 'Oct 23, 2023 04:15 PM', status: 'Action Req.', icon: 'error', colorClass: 'red' },
  { id: 'DS-2023-8750', name: 'Face Auth Metadata', description: 'Liveness detection scores', type: 'Biometric', region: 'Eastern Zone', lastUpdated: 'Oct 22, 2023 10:05 AM', status: 'Verified', icon: 'face', colorClass: 'blue' },
];

const Dataset: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [records, setRecords] = useState(INITIAL_RECORDS);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    setSearchTerm(val);
    const filtered = INITIAL_RECORDS.filter(r => 
      r.name.toLowerCase().includes(val) || 
      r.id.toLowerCase().includes(val) || 
      r.type.toLowerCase().includes(val)
    );
    setRecords(filtered);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-gray-900">
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary dark:text-blue-400">manage_search</span>
            Explore Datasets
          </h2>
          <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-600 flex items-center gap-1 hover:bg-gray-50">
            <span className="material-symbols-outlined text-sm">save_alt</span> Save View
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5 relative">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Search Query</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <span className="material-symbols-outlined text-lg">search</span>
              </span>
              <input 
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                placeholder="Search by name, ID, or description..." 
                type="text"
              />
            </div>
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Region</label>
            <select className="w-full py-2.5 px-3 text-sm border border-gray-300 rounded-lg bg-white text-gray-700">
              <option>All Regions</option>
              <option>Northern Zone</option>
              <option>Western Zone</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
            <select className="w-full py-2.5 px-3 text-sm border border-gray-300 rounded-lg bg-white text-gray-700">
              <option>All Types</option>
              <option>Biometric</option>
              <option>Auth Logs</option>
            </select>
          </div>
          <div className="md:col-span-1 flex items-end">
            <button className="w-full py-2.5 bg-primary text-white font-medium rounded-lg text-sm shadow-sm">Apply</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          { label: 'Total Datasets', val: '1,248', icon: 'dataset', color: 'blue' },
          { label: 'Active Queries', val: '56', icon: 'query_stats', color: 'green' },
          { label: 'Storage Used', val: '4.2 PB', icon: 'hard_drive', color: 'purple' },
          { label: 'Flagged Records', val: '12', icon: 'warning', color: 'yellow' }
        ].map((stat, i) => (
          <div key={i} className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.val}</p>
            </div>
            <div className={`p-2 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-800 dark:text-white">Dataset Records</h3>
            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Showing 1-10 of 1248</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-gray-500 uppercase bg-gray-50 border-b border-gray-200 font-bold">
              <tr>
                <th className="px-6 py-3" scope="col">Dataset Name</th>
                <th className="px-6 py-3" scope="col">ID</th>
                <th className="px-6 py-3" scope="col">Type</th>
                <th className="px-6 py-3" scope="col">Region</th>
                <th className="px-6 py-3" scope="col">Last Updated</th>
                <th className="px-6 py-3" scope="col">Status</th>
                <th className="px-6 py-3 text-right" scope="col">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {records.map((record) => (
                <tr key={record.id} className="bg-white hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-3">
                    <div className={`p-1.5 rounded bg-${record.colorClass}-100 text-${record.colorClass}-600`}>
                      <span className="material-symbols-outlined text-lg">{record.icon}</span>
                    </div>
                    <div>
                      {record.name}
                      <div className="text-[10px] text-gray-500 font-normal">{record.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{record.id}</td>
                  <td className="px-6 py-4 text-gray-600">{record.type}</td>
                  <td className="px-6 py-4 text-gray-600">{record.region}</td>
                  <td className="px-6 py-4 text-gray-600">{record.lastUpdated}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      record.status === 'Verified' ? 'bg-green-100 text-green-800 border-green-200' :
                      record.status === 'Action Req.' ? 'bg-red-100 text-red-800 border-red-200' :
                      'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3 text-gray-400">
                      <button className="hover:text-primary"><span className="material-symbols-outlined text-lg">visibility</span></button>
                      <button className="hover:text-primary"><span className="material-symbols-outlined text-lg">download</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dataset;
