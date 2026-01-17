
import React, { useState } from 'react';

const Profile: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'security'>('overview');

    return (
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-[#0f1522]">
            {/* Profile Header */}
            <div className="mb-8 bg-gradient-to-r from-primary via-blue-700 to-indigo-800 rounded-xl shadow-lg overflow-hidden">
                <div className="relative p-8">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
                    </div>

                    <div className="relative flex flex-col md:flex-row items-center gap-6">
                        <div className="relative">
                            <div className="h-28 w-28 rounded-full bg-gradient-to-br from-secondary to-yellow-500 p-1">
                                <div className="h-full w-full rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold">
                                    AG
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-0 h-8 w-8 bg-green-500 rounded-full border-4 border-primary flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-sm">check</span>
                            </div>
                        </div>

                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold text-white mb-1">Amit Gupta</h1>
                            <p className="text-blue-200 mb-3">Senior Infrastructure Administrator</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <span className="px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-sm align-middle mr-1">badge</span>
                                    ID: EMP-2847
                                </span>
                                <span className="px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-sm align-middle mr-1">location_on</span>
                                    Central HQ, Delhi
                                </span>
                                <span className="px-3 py-1 bg-green-500/30 text-green-100 text-xs font-medium rounded-full backdrop-blur-sm border border-green-400/30">
                                    <span className="material-symbols-outlined text-sm align-middle mr-1">verified</span>
                                    Verified
                                </span>
                            </div>
                        </div>

                        <div className="md:ml-auto">
                            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg flex items-center gap-2 transition-colors backdrop-blur-sm">
                                <span className="material-symbols-outlined">edit</span>
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    {[
                        { id: 'overview', label: 'Overview', icon: 'person' },
                        { id: 'activity', label: 'Activity Log', icon: 'history' },
                        { id: 'security', label: 'Security', icon: 'shield' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === tab.id
                                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Personal Information */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">info</span>
                                    Personal Information
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Full Name', value: 'Amit Gupta', icon: 'person' },
                                        { label: 'Email', value: 'amit.gupta@uidai.gov.in', icon: 'email' },
                                        { label: 'Phone', value: '+91 98765 43210', icon: 'phone' },
                                        { label: 'Department', value: 'Infrastructure & Operations', icon: 'business' },
                                        { label: 'Reporting To', value: 'Dr. Rajesh Kumar (CTO)', icon: 'supervisor_account' },
                                        { label: 'Join Date', value: 'March 15, 2019', icon: 'calendar_today' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <span className="material-symbols-outlined text-gray-400">{item.icon}</span>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500 uppercase">{item.label}</p>
                                                <p className="text-sm font-medium text-gray-800 dark:text-white">{item.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Permissions & Access */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
                                    Permissions & Access
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Role', value: 'Administrator', badge: 'Full Access', color: 'green' },
                                        { label: 'Data Access Level', value: 'Level 4 (Classified)', badge: 'Restricted', color: 'yellow' },
                                        { label: 'API Access', value: 'Enabled', badge: 'Active', color: 'green' },
                                        { label: 'Audit Logs', value: 'Read & Export', badge: null, color: '' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase">{item.label}</p>
                                                <p className="text-sm font-medium text-gray-800 dark:text-white">{item.value}</p>
                                            </div>
                                            {item.badge && (
                                                <span className={`px-2 py-1 text-xs font-bold rounded bg-${item.color}-100 text-${item.color}-700`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 pt-4">
                                    <span className="material-symbols-outlined text-primary">dns</span>
                                    Assigned Resources
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Servers', value: '24', icon: 'dns' },
                                        { label: 'Databases', value: '8', icon: 'database' },
                                        { label: 'APIs', value: '12', icon: 'api' },
                                        { label: 'Users', value: '156', icon: 'group' },
                                    ].map((stat, i) => (
                                        <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                                            <span className="material-symbols-outlined text-primary text-2xl mb-2">{stat.icon}</span>
                                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                                            <p className="text-xs text-gray-500">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
                            {[
                                { action: 'Logged in from Central HQ', time: '2 minutes ago', icon: 'login', color: 'green' },
                                { action: 'Updated server configuration for Node-7', time: '1 hour ago', icon: 'settings', color: 'blue' },
                                { action: 'Reviewed security audit report', time: '3 hours ago', icon: 'fact_check', color: 'purple' },
                                { action: 'Approved maintenance schedule for Oct 24', time: '5 hours ago', icon: 'check_circle', color: 'green' },
                                { action: 'Generated monthly performance report', time: 'Yesterday', icon: 'description', color: 'blue' },
                                { action: 'Modified database access permissions', time: '2 days ago', icon: 'database', color: 'orange' },
                            ].map((activity, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className={`p-2 rounded-lg bg-${activity.color}-100 text-${activity.color}-600`}>
                                        <span className="material-symbols-outlined">{activity.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800 dark:text-white">{activity.action}</p>
                                        <p className="text-xs text-gray-500">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="material-symbols-outlined text-green-600 text-2xl">verified_user</span>
                                        <h3 className="text-lg font-bold text-green-700 dark:text-green-400">Account Secure</h3>
                                    </div>
                                    <p className="text-sm text-green-600 dark:text-green-400">Your account has all security measures enabled.</p>
                                </div>
                                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <p className="text-xs text-gray-500 uppercase mb-1">Last Password Change</p>
                                    <p className="text-lg font-bold text-gray-800 dark:text-white">45 days ago</p>
                                    <button className="mt-3 text-sm text-primary font-medium hover:underline">Change Password</button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Security Settings</h3>
                                {[
                                    { label: 'Two-Factor Authentication', status: true, desc: 'Authenticator app enabled' },
                                    { label: 'Login Notifications', status: true, desc: 'Email alerts for new logins' },
                                    { label: 'Session Timeout', status: true, desc: 'Auto-logout after 30 minutes of inactivity' },
                                ].map((setting, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white">{setting.label}</p>
                                            <p className="text-xs text-gray-500">{setting.desc}</p>
                                        </div>
                                        <div className={`w-12 h-6 rounded-full ${setting.status ? 'bg-green-500' : 'bg-gray-300'} relative`}>
                                            <div className={`absolute top-1 ${setting.status ? 'right-1' : 'left-1'} w-4 h-4 bg-white rounded-full shadow transition-all`}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
