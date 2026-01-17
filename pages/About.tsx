
import React from 'react';

const About: React.FC = () => {
    return (
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-[#0f1522]">
            {/* Hero Section */}
            <div className="mb-8 bg-gradient-to-r from-primary to-blue-800 rounded-xl shadow-lg overflow-hidden">
                <div className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkiMs3GyDnxiqJOuCp2BURN_4zpfZQKkSVRSXz-BH6ULYJcC3UlEFR9Ti43lN1sumtD9Hb6Xu7BmzafDUvO6G16QuYAQOeSLd8MbCytyK-v9dwT3f_pjyX1yFrOXuTylo1sw_AtoMYmrN0Cfs-rEiWELgubn6mUm2uNvVGY6EBHMNgpU5qRS4eMsvHIUNAjtqCPFjYJZiPPscEra65y3LLoMZuWrXeinVLH3Z41lo-kZxitZQAwBLrnCQ4VczgiRUiBBR-horXgo4"
                            alt="National Emblem of India"
                            className="h-24 w-auto"
                        />
                        <div className="text-center md:text-left">
                            <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full mb-3 uppercase tracking-wider">Government of India</span>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">UIDAI Data Management Portal</h1>
                            <p className="text-lg text-blue-100 max-w-2xl">
                                Centralized platform for forecasting, stress analysis, and resource scheduling
                                for the Unique Identification Authority of India's national identity infrastructure.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                            <span className="material-symbols-outlined text-primary text-2xl">flag</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Our Mission</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        To provide a robust, secure, and transparent digital identity to all residents of India
                        through advanced data management systems. Our portal ensures efficient monitoring,
                        predictive analytics, and resource optimization for maintaining 99.99% uptime.
                    </p>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-secondary/10 rounded-lg">
                            <span className="material-symbols-outlined text-secondary text-2xl">visibility</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Our Vision</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        To be the world's most advanced digital identity infrastructure, enabling seamless
                        authentication services for over 1.4 billion citizens while maintaining the highest
                        standards of security, privacy, and operational excellence.
                    </p>
                </div>
            </div>

            {/* Key Features */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">stars</span>
                    Platform Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: 'analytics',
                            title: 'Stress Index Analysis',
                            description: 'Real-time monitoring of system health across all regional data centers with predictive alerts.',
                            color: 'blue'
                        },
                        {
                            icon: 'satellite_alt',
                            title: 'Advanced Forecasting',
                            description: 'AI-powered predictions using ensemble models combining Prophet and LSTM algorithms.',
                            color: 'purple'
                        },
                        {
                            icon: 'calendar_month',
                            title: 'Resource Scheduling',
                            description: 'Intelligent task scheduling and resource allocation for maintenance and operations.',
                            color: 'green'
                        },
                        {
                            icon: 'dns',
                            title: 'Dataset Management',
                            description: 'Centralized repository for biometric, demographic, and authentication data management.',
                            color: 'orange'
                        },
                        {
                            icon: 'security',
                            title: 'Enterprise Security',
                            description: 'Multi-layer encryption, audit trails, and compliance with government security standards.',
                            color: 'red'
                        },
                        {
                            icon: 'auto_awesome',
                            title: 'AI Integration',
                            description: 'Gemini-powered insights and automated recommendations for infrastructure optimization.',
                            color: 'indigo'
                        },
                    ].map((feature, i) => (
                        <div key={i} className="p-5 border border-gray-100 dark:border-gray-700 rounded-xl hover:shadow-md transition-shadow">
                            <div className={`inline-flex p-3 rounded-lg bg-${feature.color}-50 text-${feature.color}-600 mb-4`}>
                                <span className="material-symbols-outlined">{feature.icon}</span>
                            </div>
                            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Statistics */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-xl font-bold text-white mb-6 text-center">System Statistics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { value: '1.38B', label: 'Total Enrolments', icon: 'people' },
                        { value: '85M+', label: 'Daily Auth Requests', icon: 'verified_user' },
                        { value: '99.98%', label: 'System Uptime', icon: 'speed' },
                        { value: '4.2 PB', label: 'Data Managed', icon: 'database' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <span className="material-symbols-outlined text-secondary text-3xl mb-3">{stat.icon}</span>
                            <p className="text-3xl font-bold text-white">{stat.value}</p>
                            <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* System Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">info</span>
                        System Information
                    </h2>
                    <div className="space-y-4">
                        {[
                            { label: 'Portal Version', value: 'v2.5.1-stable' },
                            { label: 'API Version', value: 'v3.2.0' },
                            { label: 'Last Updated', value: 'October 24, 2023' },
                            { label: 'Environment', value: 'Production' },
                            { label: 'Region', value: 'Central Data Center, Delhi' },
                        ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                                <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                                <span className="text-sm font-medium text-gray-800 dark:text-white">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">support</span>
                        Support & Contact
                    </h2>
                    <div className="space-y-4">
                        {[
                            { icon: 'email', label: 'Email', value: 'support@uidai.gov.in' },
                            { icon: 'phone', label: 'Helpline', value: '1947 (Toll Free)' },
                            { icon: 'location_on', label: 'Headquarters', value: 'UIDAI, New Delhi' },
                            { icon: 'schedule', label: 'Support Hours', value: '24/7' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 py-2">
                                <span className="material-symbols-outlined text-gray-400">{item.icon}</span>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">{item.label}</p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-white">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">link</span>
                    Quick Links
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'UIDAI Official', url: 'https://uidai.gov.in', icon: 'public' },
                        { label: 'Documentation', url: '#', icon: 'description' },
                        { label: 'API Reference', url: '#', icon: 'code' },
                        { label: 'Release Notes', url: '#', icon: 'note' },
                    ].map((link, i) => (
                        <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <span className="material-symbols-outlined text-primary">{link.icon}</span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{link.label}</span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;
