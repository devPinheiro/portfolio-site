import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/cn';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    // Check for saved theme preference or default to dark
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      
      // Check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    console.log('Theme changing to:', isDark ? 'dark' : 'light');
    console.log('Root element before:', root.classList.toString());
    
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    console.log('Root element after:', root.classList.toString());
  }, [isDark]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Only update if user hasn't manually set a preference
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        setIsDark(mediaQuery.matches);
      }
    };

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return (
    <button
      onClick={() => {
        console.log('Theme toggle clicked, current isDark:', isDark);
        setIsDark(!isDark);
      }}
      className={cn(
        "relative p-2 rounded-lg transition-all duration-300 group",
        "bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700",
        "border border-gray-300 dark:border-gray-600"
      )}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <div className="relative overflow-hidden w-6 h-6">
        {/* Sun Icon */}
        <svg
          className={cn(
            "absolute inset-0 w-6 h-6 text-yellow-500 transition-all duration-300 transform",
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>
        </svg>

        {/* Moon Icon */}
        <svg
          className={cn(
            "absolute inset-0 w-6 h-6 text-blue-300 transition-all duration-300 transform",
            isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </div>

      {/* Hover tooltip */}
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {isDark ? 'Light mode' : 'Dark mode'}
      </div>
    </button>
  );
};