import React from 'react';
import { Dialog } from '@headlessui/react';
import { AIModel, AIModelParameter } from './types';

interface ModelConfigDialogProps {
  model: AIModel | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (modelId: string, parameters: AIModelParameter[]) => void;
}

export const ModelConfigDialog: React.FC<ModelConfigDialogProps> = ({
  model,
  isOpen,
  onClose,
  onSave,
}) => {
  const [parameters, setParameters] = React.useState<AIModelParameter[]>([]);

  React.useEffect(() => {
    if (model) {
      setParameters(model.parameters);
    }
  }, [model]);

  const handleParameterChange = (name: string, value: any) => {
    setParameters(prev =>
      prev.map(p => p.name === name ? { ...p, value } : p)
    );
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto pt-[10vh]"
    >
      <Dialog.Overlay className="fixed inset-0 bg-black/30" />
      
      <div className="relative max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
        <div className="p-6">
          <Dialog.Title className="text-lg font-medium">
            Configure {model?.name}
          </Dialog.Title>
          
          <div className="mt-4 space-y-4">
            {parameters.map(param => (
              <div key={param.name} className="space-y-1">
                <label className="block text-sm font-medium">
                  {param.name}
                </label>
                {param.type === 'boolean' ? (
                  <input
                    type="checkbox"
                    checked={param.value}
                    onChange={e => handleParameterChange(param.name, e.target.checked)}
                  />
                ) : param.type === 'number' ? (
                  <input
                    type="range"
                    min={param.range?.[0]}
                    max={param.range?.[1]}
                    value={param.value}
                    onChange={e => handleParameterChange(param.name, Number(e.target.value))}
                    className="w-full"
                  />
                ) : param.options ? (
                  <select
                    value={param.value}
                    onChange={e => handleParameterChange(param.name, e.target.value)}
                    className="w-full rounded-md border p-2"
                  >
                    {param.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={param.value}
                    onChange={e => handleParameterChange(param.name, e.target.value)}
                    className="w-full rounded-md border p-2"
                  />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (model) {
                  onSave(model.id, parameters);
                }
                onClose();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}; 