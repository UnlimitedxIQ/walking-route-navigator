'use client';

import { useState, useEffect } from 'react';
import { RouteMap } from '@/components/RouteMap';
import { LocationInput } from '@/components/LocationInput';
import { RoutePanel } from '@/components/RoutePanel';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-pastel-blue via-pastel-cyan to-pastel-green flex items-center justify-center">
        <div className="animate-bounce text-6xl">🚶</div>
      </div>
    );
  }

  return (
    <div className={`w-full h-screen overflow-hidden transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <div className="w-full h-screen bg-gradient-to-br from-pastel-blue via-pastel-cyan to-pastel-green dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col md:flex-row">
        {/* Left Panel - Input & Routes */}
        <div className="w-full md:w-96 h-1/2 md:h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-y-auto shadow-lg">
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md z-10">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Walk Nav 🚶
              </h1>
              <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Find your perfect walking route with sidewalks
            </p>
          </div>

          {/* Location Input */}
          <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
            <LocationInput />
          </div>

          {/* Routes Panel */}
          <div className="flex-1 overflow-y-auto">
            <RoutePanel />
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="w-full md:flex-1 h-1/2 md:h-full relative">
          <RouteMap darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}
