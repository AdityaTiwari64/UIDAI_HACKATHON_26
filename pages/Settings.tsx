
import React, { useState } from 'react';

const Settings: React.FC = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [language, setLanguage] = useState('english');
    const [timezone, setTimezone] = useState('IST');

    const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
        <button
            onClick={onChange}
            className={`w-12 h-6 rounded-full ${enabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'} relative transition-colors`}
        >
            <div className={`absolute top-1 ${enabled ? 'right-1' : 'left-1'} w-4 h-4 bg-white rounded-full shadow transition-all`}></div>
        </button>
    );

    return (
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-[#0f1522]">
            {/* Header */}
            <div className="mb-8 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-lg">
                        <span className="material-symbols-outlined text-white text-2xl">settings</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Settings</h1>
                        <p className="text-gray-300">Manage your preferences and system configuration</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Settings */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Appearance */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">palette</span>
                            Appearance
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-gray-500">dark_mode</span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white">Dark Mode</p>
                                        <p className="text-xs text-gray-500">Use dark theme for the portal</p>
                                    </div>
                                </div>
                                <Toggle enabled={darkMode} onChange={() => setDarkMode(!darkMode)} />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-gray-500">translate</span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white">Language</p>
                                        <p className="text-xs text-gray-500">Select your preferred language</p>
                                    </div>
                                </div>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                                >
                                    <option value="english">English</option>
                                    <option value="hindi">हिंदी (Hindi)</option>
                                    <option value="tamil">தமிழ் (Tamil)</option>
                                    <option value="telugu">తెలుగు (Telugu)</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-gray-500">schedule</span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white">Timezone</p>
                                        <p className="text-xs text-gray-500">Set your local timezone</p>
                                    </div>
                                </div>
                                <select
                                    value={timezone}
                                    onChange={(e) => setTimezone(e.target.value)}
                                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                                >
                                    <option value="IST">IST (UTC+5:30)</option>
                                    <option value="UTC">UTC</option>
                                    <option value="EST">EST (UTC-5)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">notifications</span>
                            Notifications
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-gray-500">notifications_active</span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white">Push Notifications</p>
                                        <p className="text-xs text-gray-500">Receive in-app notifications</p>
                                    </div>
                                </div>
                                <Toggle enabled={notifications} onChange={() => setNotifications(!notifications)} />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-gray-500">email</span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white">Email Alerts</p>
                                        <p className="text-xs text-gray-500">Get critical alerts via email</p>
                                    </div>
                                </div>
                                <Toggle enabled={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} />
                            </div>

                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm font-medium text-gray-800 dark:text-white mb-3">Alert Types</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: 'System Alerts', checked: true },
                                        { label: 'Security Alerts', checked: true },
                                        { label: 'Maintenance', checked: true },
                                        { label: 'Updates', checked: false },
                                    ].map((item, i) => (
                                        <label key={i} className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" defaultChecked={item.checked} className="rounded border-gray-300 text-primary focus:ring-primary" />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data & Display */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">tune</span>
                            Data & Display
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-gray-500">refresh</span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white">Auto-Refresh Data</p>
                                        <p className="text-xs text-gray-500">Automatically refresh dashboard data</p>
                                    </div>
                                </div>
                                <Toggle enabled={autoRefresh} onChange={() => setAutoRefresh(!autoRefresh)} />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-gray-500">timer</span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white">Refresh Interval</p>
                                        <p className="text-xs text-gray-500">How often to refresh data</p>
                                    </div>
                                </div>
                                <select className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                                    <option>30 seconds</option>
                                    <option>1 minute</option>
                                    <option>5 minutes</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-gray-500">table_rows</span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white">Default Page Size</p>
                                        <p className="text-xs text-gray-500">Items per page in tables</p>
                                    </div>
                                </div>
                                <select className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                                    <option>10</option>
                                    <option>25</option>
                                    <option>50</option>
                                    <option>100</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">bolt</span>
                            Quick Actions
                        </h2>
                        <div className="space-y-3">
                            {[
                                { label: 'Export Settings', icon: 'download', color: 'blue' },
                                { label: 'Import Settings', icon: 'upload', color: 'green' },
                                { label: 'Reset to Default', icon: 'restart_alt', color: 'orange' },
                                { label: 'Clear Cache', icon: 'delete_sweep', color: 'red' },
                            ].map((action, i) => (
                                <button key={i} className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left">
                                    <span className={`p-2 rounded-lg bg-${action.color}-50 text-${action.color}-600`}>
                                        <span className="material-symbols-outlined text-sm">{action.icon}</span>
                                    </span>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Keyboard Shortcuts */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">keyboard</span>
                            Keyboard Shortcuts
                        </h2>
                        <div className="space-y-3">
                            {[
                                { keys: ['Ctrl', 'D'], action: 'Dashboard' },
                                { keys: ['Ctrl', 'S'], action: 'Stress Index' },
                                { keys: ['Ctrl', 'F'], action: 'Forecasting' },
                                { keys: ['Ctrl', '/'], action: 'Search' },
                            ].map((shortcut, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{shortcut.action}</span>
                                    <div className="flex gap-1">
                                        {shortcut.keys.map((key, j) => (
                                            <kbd key={j} className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded border border-gray-200 dark:border-gray-600">
                                                {key}
                                            </kbd>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* System Info */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">info</span>
                            System Info
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Version</span>
                                <span className="font-medium text-gray-800 dark:text-white">v2.5.1-stable</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Last Updated</span>
                                <span className="font-medium text-gray-800 dark:text-white">Oct 24, 2023</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Build</span>
                                <span className="font-medium text-gray-800 dark:text-white">#4892</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 flex justify-end gap-4">
                <button className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    Cancel
                </button>
                <button className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined">save</span>
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default Settings;
