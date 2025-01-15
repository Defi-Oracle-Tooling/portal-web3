import React from 'react';
import { useTheme } from '../../providers/ThemeProvider';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-12 bg-gray-800 text-white flex items-center justify-between px-4">
      <h1>Web3 Dashboard</h1>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-md hover:bg-gray-700"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </header>
  );
}; 