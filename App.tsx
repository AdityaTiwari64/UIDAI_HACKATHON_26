
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Forecasting from './pages/Forecasting';
import Dataset from './pages/Dataset';
import { Page } from './types';

// Placeholder for other pages
const StressIndex = () => <div className="p-8"><h1 className="text-2xl font-bold">System Stress Index Analysis (TBD)</h1></div>;
const Scheduling = () => <div className="p-8"><h1 className="text-2xl font-bold">Resource & Task Scheduling (TBD)</h1></div>;
const About = () => <div className="p-8"><h1 className="text-2xl font-bold">About & System Information (TBD)</h1></div>;

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);

  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME: return <Dashboard />;
      case Page.STRESS_INDEX: return <StressIndex />;
      case Page.FORECASTING: return <Forecasting />;
      case Page.SCHEDULING: return <Scheduling />;
      case Page.DATASET: return <Dataset />;
      case Page.ABOUT: return <About />;
      default: return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case Page.HOME: return 'Dashboard Overview';
      case Page.STRESS_INDEX: return 'System Stress Index Analysis';
      case Page.FORECASTING: return 'Advanced Predictive Forecasting';
      case Page.SCHEDULING: return 'Resource & Task Scheduling';
      case Page.DATASET: return 'Dataset Management';
      case Page.ABOUT: return 'About & System Information';
      default: return 'Data Portal';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <Sidebar currentPage={currentPage} setPage={setCurrentPage} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 h-16 flex items-center justify-between px-8 shadow-sm z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white tracking-tight">{getPageTitle()}</h1>
            {currentPage === Page.STRESS_INDEX && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-primary dark:bg-blue-900 dark:text-blue-300 border border-blue-200 uppercase">Live Data</span>
            )}
            {currentPage === Page.FORECASTING && (
              <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold uppercase rounded border border-secondary/20">Beta v2.1</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <span className="material-symbols-outlined text-lg">search</span>
              </span>
              <input 
                className="pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                placeholder={`Search ${currentPage}...`} 
                type="text" 
              />
            </div>
            <button className="relative p-2 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
            {currentPage === Page.DATASET && (
              <button className="ml-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-blue-800 flex items-center gap-2 shadow-sm transition-colors">
                <span className="material-symbols-outlined text-sm">cloud_upload</span>
                Upload
              </button>
            )}
          </div>
        </header>

        {renderPage()}

        <footer className="mt-auto py-6 px-8 border-t border-gray-200 dark:border-gray-800 text-center text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest bg-surface-light dark:bg-surface-dark">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p>© 2023 Unique Identification Authority of India. Official Government Data Portal.</p>
            <div className="mt-2 md:mt-0 space-x-6">
              <button className="hover:text-primary">Privacy Policy</button>
              <button className="hover:text-primary">Terms of Service</button>
              <button className="hover:text-primary">Help Desk</button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
