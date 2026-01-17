
import React, { useState } from 'react';
import { Task } from '../types';

const INITIAL_TASKS: Task[] = [
    { id: 'SCH-001', title: 'Database Maintenance Window', description: 'Perform routine maintenance on primary database cluster including index optimization and log cleanup.', date: '2023-10-24', priority: 'High', status: 'Pending' },
    { id: 'SCH-002', title: 'Security Audit - North Region', description: 'Quarterly security audit for all North Zone data centers and enrollment facilities.', date: '2023-10-26', priority: 'High', status: 'Confirmed' },
    { id: 'SCH-003', title: 'ML Model Retraining', description: 'Retrain forecasting models with updated Q3 data for improved prediction accuracy.', date: '2023-10-28', priority: 'Medium', status: 'Pending' },
    { id: 'SCH-004', title: 'Server Migration - Phase 2', description: 'Migrate legacy authentication servers to new cloud infrastructure.', date: '2023-10-30', priority: 'High', status: 'Pending' },
    { id: 'SCH-005', title: 'Backup Verification', description: 'Verify integrity of all backup systems and perform test restore procedures.', date: '2023-11-01', priority: 'Medium', status: 'Confirmed' },
    { id: 'SCH-006', title: 'API Gateway Update', description: 'Deploy new API gateway version with enhanced rate limiting and monitoring.', date: '2023-11-03', priority: 'Low', status: 'Pending' },
];

const Scheduling: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
    const [selectedView, setSelectedView] = useState<'list' | 'calendar'>('list');
    const [filterPriority, setFilterPriority] = useState<string>('All');
    const [showNewTaskModal, setShowNewTaskModal] = useState(false);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-700 border-red-200';
            case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Low': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-500';
            case 'Pending': return 'bg-yellow-500';
            case 'Completed': return 'bg-blue-500';
            default: return 'bg-gray-500';
        }
    };

    const filteredTasks = filterPriority === 'All'
        ? tasks
        : tasks.filter(t => t.priority === filterPriority);

    const upcomingTasks = filteredTasks.filter(t => t.status !== 'Completed').slice(0, 3);

    return (
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-[#0f1522]">
            {/* Header Section */}
            <div className="mb-6 bg-gradient-to-r from-primary to-blue-800 rounded-xl shadow-lg p-6 text-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Resource & Task Scheduling</h2>
                        <p className="text-blue-200">Manage maintenance windows, infrastructure tasks, and resource allocation</p>
                    </div>
                    <button
                        onClick={() => setShowNewTaskModal(true)}
                        className="px-4 py-2 bg-secondary hover:bg-secondary/90 text-white rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                    >
                        <span className="material-symbols-outlined">add</span>
                        New Schedule
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {[
                    { label: 'Total Scheduled', value: tasks.length.toString(), icon: 'event', color: 'blue' },
                    { label: 'Pending Approval', value: tasks.filter(t => t.status === 'Pending').length.toString(), icon: 'pending', color: 'yellow' },
                    { label: 'Confirmed', value: tasks.filter(t => t.status === 'Confirmed').length.toString(), icon: 'check_circle', color: 'green' },
                    { label: 'This Week', value: '4', icon: 'date_range', color: 'purple' },
                ].map((stat, i) => (
                    <div key={i} className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stat.value}</p>
                            </div>
                            <div className={`p-2 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                                <span className="material-symbols-outlined">{stat.icon}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* View Toggle and Filters */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                            <button
                                onClick={() => setSelectedView('list')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${selectedView === 'list' ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
                            >
                                <span className="material-symbols-outlined text-sm align-middle mr-1">view_list</span>
                                List View
                            </button>
                            <button
                                onClick={() => setSelectedView('calendar')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${selectedView === 'calendar' ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
                            >
                                <span className="material-symbols-outlined text-sm align-middle mr-1">calendar_month</span>
                                Calendar
                            </button>
                        </div>
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                        >
                            <option value="All">All Priorities</option>
                            <option value="High">High Priority</option>
                            <option value="Medium">Medium Priority</option>
                            <option value="Low">Low Priority</option>
                        </select>
                    </div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <span className="material-symbols-outlined text-lg">search</span>
                        </span>
                        <input
                            className="pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Search tasks..."
                            type="text"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tasks List */}
                <div className="lg:col-span-2">
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                            <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">task</span>
                                Scheduled Tasks
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredTasks.map((task) => (
                                <div key={task.id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(task.status)}`}></div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-semibold text-gray-800 dark:text-white">{task.title}</h4>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPriorityColor(task.priority)}`}>
                                                        {task.priority}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{task.description}</p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                                                        {new Date(task.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-sm">tag</span>
                                                        {task.id}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Upcoming & Quick Actions */}
                <div className="space-y-6">
                    {/* Upcoming Tasks */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">upcoming</span>
                            Upcoming
                        </h3>
                        <div className="space-y-4">
                            {upcomingTasks.map((task, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="flex flex-col items-center min-w-[2.5rem]">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase">
                                            {new Date(task.date).toLocaleDateString('en-US', { month: 'short' })}
                                        </span>
                                        <span className="text-lg font-bold text-gray-800 dark:text-white">
                                            {new Date(task.date).getDate()}
                                        </span>
                                    </div>
                                    <div className={`flex-1 ${i < upcomingTasks.length - 1 ? 'pb-4 border-b border-gray-100 dark:border-gray-800' : ''}`}>
                                        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{task.title}</h4>
                                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold border ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">bolt</span>
                            Quick Actions
                        </h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Schedule Maintenance', icon: 'build', color: 'blue' },
                                { label: 'Request Resources', icon: 'memory', color: 'purple' },
                                { label: 'Generate Report', icon: 'description', color: 'green' },
                                { label: 'View Conflicts', icon: 'warning', color: 'orange' },
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

                    {/* Resource Allocation */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">group</span>
                            Resource Allocation
                        </h3>
                        <div className="space-y-4">
                            {[
                                { name: 'Infrastructure Team', allocated: 85, color: 'blue' },
                                { name: 'Security Team', allocated: 60, color: 'green' },
                                { name: 'Database Admins', allocated: 95, color: 'red' },
                            ].map((resource, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{resource.name}</span>
                                        <span className="text-xs font-bold text-gray-500">{resource.allocated}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full bg-${resource.color}-500 transition-all`}
                                            style={{ width: `${resource.allocated}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Scheduling;
