import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { useMindMap } from '../../context/MindMapContext';

const Controls = () => {
  const { zoomIn, zoomOut, resetView, scale } = useMindMap();
  
  return (
    <motion.div 
      className="absolute right-4 bottom-4 flex flex-col p-1 rounded-lg bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-sm border border-surface-dark/10 dark:border-surface-light/10 shadow-lg"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.5 }}
    >
      <button 
        className="p-2 rounded-lg hover:bg-primary-500/10 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-400"
        onClick={zoomIn}
      >
        <Plus size={20} />
      </button>
      
      <div className="px-2 py-1 text-xs text-center font-mono">
        {Math.round(scale * 100)}%
      </div>
      
      <button 
        className="p-2 rounded-lg hover:bg-primary-500/10 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-400"
        onClick={zoomOut}
      >
        <Minus size={20} />
      </button>
      
      <div className="my-1 h-px bg-surface-dark/10 dark:bg-surface-light/10" />
      
      <button 
        className="p-2 rounded-lg hover:bg-primary-500/10 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-400"
        onClick={resetView}
      >
        <RotateCcw size={18} />
      </button>
    </motion.div>
  );
};

export default Controls;