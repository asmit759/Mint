import React from 'react';
import { useTheme } from './ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-surface text-text-primary hover:bg-border transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-center"
      aria-label="Toggle Theme"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  );
};

export default ThemeToggle;
