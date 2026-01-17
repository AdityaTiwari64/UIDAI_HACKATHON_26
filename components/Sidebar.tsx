
import React from 'react';
import { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage }) => {
  const navItems = [
    { id: Page.HOME, label: 'Home', icon: 'home' },
    { id: Page.STRESS_INDEX, label: 'Stress Index', icon: 'analytics' },
    { id: Page.FORECASTING, label: 'Forecasting', icon: 'satellite_alt' },
    { id: Page.SCHEDULING, label: 'Scheduling', icon: 'calendar_month' },
    { id: Page.DATASET, label: 'Dataset', icon: 'dns' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-background-light dark:bg-background-dark flex flex-col transition-colors duration-200 z-20">
      <div className="p-6 flex items-center gap-3">
        <img alt="National Emblem of India" className="h-10 w-auto opacity-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkiMs3GyDnxiqJOuCp2BURN_4zpfZQKkSVRSXz-BH6ULYJcC3UlEFR9Ti43lN1sumtD9Hb6Xu7BmzafDUvO6G16QuYAQOeSLd8MbCytyK-v9dwT3f_pjyX1yFrOXuTylo1sw_AtoMYmrN0Cfs-rEiWELgubn6mUm2uNvVGY6EBHMNgpU5qRS4eMsvHIUNAjtqCPFjYJZiPPscEra65y3LLoMZuWrXeinVLH3Z41lo-kZxitZQAwBLrnCQ4VczgiRUiBBR-horXgo4" />
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider leading-none">Government of India</span>
          <span className="text-sm font-bold text-primary dark:text-blue-400">Data Portal</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`w-full group flex items-center px-4 py-3 rounded-lg font-medium transition-all ${
              currentPage === item.id
                ? 'bg-white dark:bg-surface-dark shadow-sm text-primary dark:text-blue-100 border border-gray-100 dark:border-gray-700'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-blue-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <span className={`material-symbols-outlined mr-3 text-xl transition-transform ${currentPage === item.id ? 'text-secondary scale-110' : 'text-gray-400 group-hover:text-primary'}`}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}

        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setPage(Page.ABOUT)}
            className={`w-full group flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
              currentPage === Page.ABOUT
                ? 'bg-white dark:bg-surface-dark shadow-sm text-primary dark:text-blue-100 border border-gray-100 dark:border-gray-700'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-blue-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <span className={`material-symbols-outlined mr-3 text-xl ${currentPage === Page.ABOUT ? 'text-secondary' : 'text-gray-400'}`}>
              info
            </span>
            About
          </button>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
            AG
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Amit Gupta</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Administrator</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
