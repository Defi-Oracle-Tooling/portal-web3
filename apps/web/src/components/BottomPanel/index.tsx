import React, { useState } from 'react';
import { Terminal } from './Terminal';

type Tab = 'history' | 'communication' | 'logs' | 'terminal';

export const BottomPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('terminal');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'history', label: 'History' },
    { id: 'communication', label: 'Communication' },
    { id: 'logs', label: 'Logs' },
    { id: 'terminal', label: '800 Terminal' }
  ];

  return (
    <div className="h-full bg-gray-100 dark:bg-gray-900">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400'
                : 'hover:bg-gray-200 dark:hover:bg-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="h-[calc(100%-2.5rem)]">
        {activeTab === 'terminal' && <Terminal />}
        {/* Add other tab contents here */}
      </div>
    </div>
  );
}; 