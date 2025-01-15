import React, { useState } from 'react';
import { AIModel } from './types';
import { AIModelCard } from './AIModelCard';
import { ModelConfigDialog } from './ModelConfigDialog';
import { useWebSocket } from '../../../providers/WebSocketProvider';

export const FusionAI: React.FC = () => {
  const [models, setModels] = useState<AIModel[]>([
    {
      id: 'gpt4',
      name: 'GPT-4',
      description: 'Advanced language model for general tasks',
      status: 'active',
      type: 'llm',
      capabilities: ['text-generation', 'code-completion', 'analysis'],
      parameters: [
        {
          name: 'temperature',
          type: 'number',
          value: 0.7,
          range: [0, 1]
        },
        {
          name: 'maxTokens',
          type: 'number',
          value: 2048,
          range: [1, 4096]
        }
      ]
    },
    {
      id: 'claude',
      name: 'Claude',
      description: 'Specialized in analysis and reasoning',
      status: 'active',
      type: 'llm',
      capabilities: ['text-generation', 'analysis', 'reasoning'],
      parameters: [
        {
          name: 'mode',
          type: 'string',
          value: 'precise',
          options: ['precise', 'creative', 'balanced']
        }
      ]
    }
  ]);

  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const ws = useWebSocket();

  const handleToggle = (id: string) => {
    setModels(prev => prev.map(model => 
      model.id === id 
        ? { ...model, status: model.status === 'active' ? 'inactive' : 'active' }
        : model
    ));
  };

  const handleConfigure = (id: string) => {
    const model = models.find(m => m.id === id);
    if (model) {
      setSelectedModel(model);
      setIsConfigOpen(true);
    }
  };

  const handleSaveConfig = (modelId: string, parameters: any[]) => {
    setModels(prev => prev.map(model =>
      model.id === modelId
        ? { ...model, parameters }
        : model
    ));
    
    // Notify the server about the configuration change
    ws.emit('model:configure', { modelId, parameters });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">AI Models</h3>
        <button 
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => {/* TODO: Implement add model */}}
        >
          Add Model
        </button>
      </div>
      
      <div className="space-y-2">
        {models.map((model) => (
          <AIModelCard
            key={model.id}
            model={model}
            onToggle={handleToggle}
            onConfigure={handleConfigure}
          />
        ))}
      </div>

      <ModelConfigDialog
        model={selectedModel}
        isOpen={isConfigOpen}
        onClose={() => {
          setIsConfigOpen(false);
          setSelectedModel(null);
        }}
        onSave={handleSaveConfig}
      />
    </div>
  );
}; 