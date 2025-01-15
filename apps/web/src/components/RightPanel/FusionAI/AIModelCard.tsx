import React from 'react';
import { DraggableComponent } from '@web3-dashboard/ui';
import { AIModel } from './types';

interface AIModelCardProps {
  model: AIModel;
  onToggle: (id: string) => void;
  onConfigure: (id: string) => void;
}

export const AIModelCard: React.FC<AIModelCardProps> = ({ model, onToggle, onConfigure }) => {
  return (
    <DraggableComponent>
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">{model.name}</h4>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onConfigure(model.id)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              ⚙️
            </button>
            <span 
              className={`px-2 py-1 rounded-full text-xs ${
                model.status === 'active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}
              onClick={() => onToggle(model.id)}
            >
              {model.status}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          {model.description}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {model.capabilities.map((cap, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 text-xs rounded"
            >
              {cap}
            </span>
          ))}
        </div>
      </div>
    </DraggableComponent>
  );
}; 