import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

const SettingsModal = () => {
  const { 
    toggleSettings, 
    autoExpandNodes, toggleAutoExpandNodes,
    animationsEnabled, toggleAnimations,
    showGrid, toggleGrid,
    snapToGrid, toggleSnapToGrid,
    lineStyle, setLineStyle,
    lineThickness, setLineThickness
  } = useSettingsStore();
  
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const modalVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 500
      }
    }
  };
  
  return (
    <motion.div 
      className="fixed inset-0 bg-background-dark/50 backdrop-blur-sm flex items-center justify-center z-50"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={toggleSettings}
    >
      <motion.div 
        className="relative w-full max-w-md rounded-xl bg-surface-light dark:bg-surface-dark shadow-2xl border border-surface-dark/10 dark:border-surface-light/10 p-6"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-clash font-semibold">Settings</h2>
          <motion.button
            className="p-1 rounded-lg hover:bg-surface-dark/10 dark:hover:bg-surface-light/10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSettings}
          >
            <X size={20} />
          </motion.button>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-2">Behavior</h3>
            
            <div className="flex items-center justify-between">
              <label className="text-sm">Auto-expand nodes</label>
              <div 
                className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors duration-200 ${autoExpandNodes ? 'bg-primary-500' : 'bg-surface-dark/20 dark:bg-surface-light/20'}`}
                onClick={toggleAutoExpandNodes}
              >
                <motion.div 
                  className="w-4 h-4 rounded-full bg-white" 
                  animate={{ x: autoExpandNodes ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm">Enable animations</label>
              <div 
                className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors duration-200 ${animationsEnabled ? 'bg-primary-500' : 'bg-surface-dark/20 dark:bg-surface-light/20'}`}
                onClick={toggleAnimations}
              >
                <motion.div 
                  className="w-4 h-4 rounded-full bg-white" 
                  animate={{ x: animationsEnabled ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm">Show grid</label>
              <div 
                className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors duration-200 ${showGrid ? 'bg-primary-500' : 'bg-surface-dark/20 dark:bg-surface-light/20'}`}
                onClick={toggleGrid}
              >
                <motion.div 
                  className="w-4 h-4 rounded-full bg-white" 
                  animate={{ x: showGrid ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm">Snap to grid</label>
              <div 
                className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors duration-200 ${snapToGrid ? 'bg-primary-500' : 'bg-surface-dark/20 dark:bg-surface-light/20'}`}
                onClick={toggleSnapToGrid}
              >
                <motion.div 
                  className="w-4 h-4 rounded-full bg-white" 
                  animate={{ x: snapToGrid ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-2">Appearance</h3>
            
            <div className="space-y-2">
              <label className="text-sm">Connection line style</label>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  className={`p-2 text-xs rounded-lg ${lineStyle === 'straight' ? 'bg-primary-500 text-white' : 'bg-surface-dark/10 dark:bg-surface-light/10'}`}
                  onClick={() => setLineStyle('straight')}
                >
                  Straight
                </button>
                <button 
                  className={`p-2 text-xs rounded-lg ${lineStyle === 'curved' ? 'bg-primary-500 text-white' : 'bg-surface-dark/10 dark:bg-surface-light/10'}`}
                  onClick={() => setLineStyle('curved')}
                >
                  Curved
                </button>
                <button 
                  className={`p-2 text-xs rounded-lg ${lineStyle === 'bezier' ? 'bg-primary-500 text-white' : 'bg-surface-dark/10 dark:bg-surface-light/10'}`}
                  onClick={() => setLineStyle('bezier')}
                >
                  Bezier
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm">Line thickness</label>
              <div className="flex items-center">
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  step="1" 
                  value={lineThickness}
                  onChange={(e) => setLineThickness(parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="ml-2 text-sm w-6 text-center">{lineThickness}</span>
              </div>
            </div>
          </div>
          
          <div className="pt-2 border-t border-surface-dark/10 dark:border-surface-light/10">
            <div className="flex justify-between text-xs text-surface-dark/60 dark:text-surface-light/60">
              <span>Keyboard Shortcuts</span>
              <button className="underline hover:text-primary-500">View All</button>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between items-center">
                <span>Add Node</span>
                <kbd className="px-2 py-0.5 rounded bg-surface-dark/10 dark:bg-surface-light/10">N</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Delete</span>
                <kbd className="px-2 py-0.5 rounded bg-surface-dark/10 dark:bg-surface-light/10">Del</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Search</span>
                <kbd className="px-2 py-0.5 rounded bg-surface-dark/10 dark:bg-surface-light/10">Ctrl+K</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Reset View</span>
                <kbd className="px-2 py-0.5 rounded bg-surface-dark/10 dark:bg-surface-light/10">Ctrl+0</kbd>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsModal;