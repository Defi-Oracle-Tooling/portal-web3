import React, { useState, useRef, useEffect } from 'react';
import { commands, parseCommand, CommandResult } from './commands';

interface Command {
  input: string;
  output: string;
  timestamp: Date;
  success?: boolean;
}

export const Terminal: React.FC = () => {
  const [history, setHistory] = useState<Command[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const processCommand = async (input: string) => {
    const { command, args } = parseCommand(input);
    
    if (!commands[command]) {
      return {
        success: false,
        output: `Unknown command: ${command}. Type 'help' for available commands.`
      };
    }

    try {
      return await commands[command].execute(args);
    } catch (error) {
      return {
        success: false,
        output: `Error executing command: ${error.message}`
      };
    }
  };

  const handleCommand = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentInput.trim()) {
      const input = currentInput.trim();
      setCurrentInput('');
      setHistoryIndex(-1);

      const result = await processCommand(input);
      
      setHistory(prev => [...prev, {
        input,
        output: result.output,
        timestamp: new Date(),
        success: result.success
      }]);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(history[history.length - 1 - newIndex].input);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(history[history.length - 1 - newIndex].input);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-green-400 font-mono">
      <div className="flex items-center px-4 py-2 bg-gray-800">
        <span className="text-sm">800 Terminal</span>
      </div>
      
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2"
      >
        {history.map((cmd, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center">
              <span className="text-green-500">$ </span>
              <span className="ml-2">{cmd.input}</span>
            </div>
            <div className={`ml-4 ${cmd.success === false ? 'text-red-400' : 'text-gray-400'}`}>
              {cmd.output}
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-700 p-4 flex items-center">
        <span className="text-green-500">$ </span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleCommand}
          className="flex-1 ml-2 bg-transparent outline-none"
          placeholder="Type 'help' for available commands..."
        />
      </div>
    </div>
  );
}; 