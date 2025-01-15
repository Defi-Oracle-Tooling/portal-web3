import React, { useState, useEffect, useMemo } from 'react';
import { Dialog } from '@headlessui/react';
import { useCommands } from './commands';
import { CommandCategory, PaletteCommand } from './types';
import Fuse from 'fuse.js';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<CommandCategory | null>(null);
  const [activeSection, setActiveSection] = useState<'categories' | 'commands'>('commands');
  const commands = useCommands();
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedCommand, setSelectedCommand] = useState<PaletteCommand | null>(null);
  
  const fuse = useMemo(() => new Fuse(commands, {
    keys: ['title', 'keywords', 'category'],
    threshold: 0.3,
  }), [commands]);

  const filteredCommands = useMemo(() => {
    if (!search) return commands;
    return fuse.search(search).map(result => result.item);
  }, [search, commands, fuse]);

  const groupedCommands = useMemo(() => {
    const grouped = filteredCommands.reduce((acc, command) => {
      if (!acc[command.category]) {
        acc[command.category] = [];
      }
      acc[command.category].push(command);
      return acc;
    }, {} as Record<CommandCategory, PaletteCommand[]>);

    // Sort categories alphabetically
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredCommands]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (true) {
      // Quick category jumps
      case e.altKey && e.key >= '1' && e.key <= '9':
        e.preventDefault();
        const categories = Object.keys(groupedCommands);
        const categoryIndex = parseInt(e.key) - 1;
        if (categoryIndex < categories.length) {
          setSelectedCategory(categories[categoryIndex] as CommandCategory);
          setActiveSection('commands');
        }
        break;

      // Quick actions
      case e.ctrlKey && e.key === 'b':
        e.preventDefault();
        setSelectedCategory('blockchain');
        setActiveSection('commands');
        break;

      case e.ctrlKey && e.key === 'm':
        e.preventDefault();
        setSelectedCategory('market');
        setActiveSection('commands');
        break;

      case e.ctrlKey && e.key === 'a':
        e.preventDefault();
        setSelectedCategory('analytics');
        setActiveSection('commands');
        break;

      // Search history navigation
      case e.ctrlKey && e.key === 'p':
        e.preventDefault();
        if (historyIndex < searchHistory.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setSearch(searchHistory[searchHistory.length - 1 - newIndex]);
        }
        break;

      case e.ctrlKey && e.key === 'n':
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setSearch(searchHistory[searchHistory.length - 1 - newIndex]);
        }
        break;

      // Command preview/details
      case e.key === 'Space' && e.ctrlKey:
        e.preventDefault();
        const command = filteredCommands[selectedIndex];
        if (command) {
          setSelectedCommand(command);
        }
        break;

      case 'Tab':
        e.preventDefault();
        // Toggle between categories and commands
        setActiveSection(prev => prev === 'categories' ? 'commands' : 'categories');
        break;

      case 'ArrowRight':
        if (activeSection === 'categories') {
          e.preventDefault();
          setActiveSection('commands');
        }
        break;

      case 'ArrowLeft':
        if (activeSection === 'commands') {
          e.preventDefault();
          setActiveSection('categories');
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (activeSection === 'categories') {
          const categories = Object.keys(groupedCommands);
          const currentIndex = selectedCategory ? categories.indexOf(selectedCategory) : -1;
          const nextIndex = currentIndex < categories.length - 1 ? currentIndex + 1 : 0;
          setSelectedCategory(categories[nextIndex] as CommandCategory);
        } else {
          setSelectedIndex(i => i < filteredCommands.length - 1 ? i + 1 : 0);
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (activeSection === 'categories') {
          const categories = Object.keys(groupedCommands);
          const currentIndex = selectedCategory ? categories.indexOf(selectedCategory) : 0;
          const nextIndex = currentIndex > 0 ? currentIndex - 1 : categories.length - 1;
          setSelectedCategory(categories[nextIndex] as CommandCategory);
        } else {
          setSelectedIndex(i => i > 0 ? i - 1 : filteredCommands.length - 1);
        }
        break;

      case 'Enter':
        e.preventDefault();
        const selectedCommand = filteredCommands[selectedIndex];
        if (selectedCommand) {
          executeCommand(selectedCommand);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  // Filter commands by selected category
  const filteredAndGroupedCommands = useMemo(() => {
    if (selectedCategory) {
      return groupedCommands.filter(([category]) => category === selectedCategory);
    }
    return groupedCommands;
  }, [groupedCommands, selectedCategory]);

  // Add search to history when command is executed
  const executeCommand = (command: PaletteCommand) => {
    if (search) {
      setSearchHistory(prev => [...prev, search]);
    }
    command.action();
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="fixed inset-0 z-50 overflow-y-auto pt-[25vh]"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="relative max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center px-4 py-2">
              <span className="text-gray-500 dark:text-gray-400">⌘</span>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                className="w-full px-2 py-1 bg-transparent border-0 outline-none"
                placeholder="Type a command or search..."
                autoFocus
              />
            </div>
          </div>

          <div className="flex space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700">
            {Object.keys(groupedCommands).map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category as CommandCategory);
                  setActiveSection('commands');
                }}
                className={`
                  px-3 py-1 rounded-md text-sm transition-all duration-150
                  ${selectedCategory === category
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                  }
                  ${activeSection === 'categories' && selectedCategory === category
                    ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-700'
                    : ''
                  }
                  ${activeSection === 'categories'
                    ? 'transform hover:scale-105'
                    : ''
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {filteredAndGroupedCommands.map(([category, commands]) => (
              <div key={category} className="relative">
                <div className="sticky top-0 px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 z-10">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </div>
                {commands.map((command, index) => (
                  <button
                    key={command.id}
                    onClick={() => {
                      executeCommand(command);
                    }}
                    className={`
                      w-full px-4 py-2 flex items-center space-x-3 text-left
                      transition-all duration-150
                      ${filteredCommands.indexOf(command) === selectedIndex
                        ? 'bg-blue-50 dark:bg-blue-900 shadow-md transform scale-[1.02]'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <span className="text-lg transform transition-transform duration-150 group-hover:scale-110">
                      {command.icon}
                    </span>
                    <div className="flex-1">
                      <div className="font-medium">{command.title}</div>
                      {command.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {command.description}
                        </div>
                      )}
                    </div>
                    {command.shortcut && (
                      <div className="text-sm text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {command.shortcut}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Enhanced Keyboard Navigation Helper */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="font-medium">Navigation</div>
                <div className="flex flex-col space-y-1">
                  <span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">↑↓</kbd> Navigate items
                  </span>
                  <span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Tab</kbd> Switch section
                  </span>
                  <span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Alt+[1-9]</kbd> Quick category
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Actions</div>
                <div className="flex flex-col space-y-1">
                  <span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Ctrl+B</kbd> Blockchain
                  </span>
                  <span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Ctrl+M</kbd> Market
                  </span>
                  <span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Ctrl+A</kbd> Analytics
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Search History</div>
                <div className="flex flex-col space-y-1">
                  <span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Ctrl+P</kbd> Previous
                  </span>
                  <span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Ctrl+N</kbd> Next
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Other</div>
                <div className="flex flex-col space-y-1">
                  <span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Ctrl+Space</kbd> Preview
                  </span>
                  <span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Esc</kbd> Close
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Command Preview Modal */}
          {selectedCommand && (
            <div className="absolute bottom-20 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">{selectedCommand.icon}</span>
                <h3 className="text-lg font-medium">{selectedCommand.title}</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {selectedCommand.description}
              </p>
              {selectedCommand.shortcut && (
                <div className="text-sm text-gray-400">
                  Shortcut: {selectedCommand.shortcut}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}; 