import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useSettingsStore } from '../../store/settingsStore';
import ThemeToggle from '../ui/ThemeToggle';
import { Brain, Download, Settings, User } from 'lucide-react';

const TopBar = () => {
  const { toggleSettings } = useSettingsStore();
  
  return (
    <motion.header 
      className="flex items-center justify-between px-4 py-2 border-b border-surface-dark/10 dark:border-surface-light/10 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-lg z-20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
    >
      <div className="flex items-center gap-2">
        <motion.div 
          className="p-1 rounded-lg bg-primary-500/20 text-primary-600 dark:text-primary-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Brain size={24} />
        </motion.div>
        <h1 className="text-xl font-clash font-semibold tracking-tight">NeuraMind</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <motion.button 
          className="btn-ghost"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download size={20} />
          <span className="ml-1 hidden md:inline">Export</span>
        </motion.button>
        
        <ThemeToggle />
        
        <motion.button 
          className="btn-ghost"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSettings}
        >
          <Settings size={20} />
        </motion.button>
        
        <motion.button 
          className="ml-2 p-1 rounded-full bg-primary-500/10 dark:bg-primary-500/20 hover:bg-primary-500/20 dark:hover:bg-primary-500/30 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <User size={20} className="text-primary-600 dark:text-primary-400" />
        </motion.button>
      </div>
    </motion.header>
  );
};

export default TopBar;