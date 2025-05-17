import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Search, Zap, Trash, PanelLeft } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { useMindMap } from '../../context/MindMapContext';

const Sidebar = () => {
  const { sidebarOpen, toggleSidebar } = useSettingsStore();
  const { addNode, clearAll } = useMindMap();
  
  const handleAddMainNode = () => {
    addNode({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      content: 'Main Idea',
    });
  };
  
  const sidebarVariants = {
    open: { 
      width: '240px',
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    closed: { 
      width: '56px',
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };
  
  return (
    <motion.div 
      className="h-full bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-sm border-r border-surface-dark/10 dark:border-surface-light/10 z-10"
      initial="closed"
      animate={sidebarOpen ? "open" : "closed"}
      variants={sidebarVariants}
    >
      <div className="flex flex-col h-full">
        <div className="p-2 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className="p-1 rounded-lg hover:bg-surface-dark/10 dark:hover:bg-surface-light/10"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </motion.button>
        </div>
        
        <div className="flex-1 overflow-auto p-2">
          <AnimatePresence mode="wait">
            {sidebarOpen ? (
              <motion.div
                key="sidebar-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-sm uppercase font-medium text-surface-dark/60 dark:text-surface-light/60 mb-2 ml-2">Tools</h3>
                
                <div className="space-y-1">
                  <button className="sidebar-item active w-full" onClick={handleAddMainNode}>
                    <Plus size={18} />
                    <span>Add Main Node</span>
                  </button>
                  
                  <button className="sidebar-item w-full">
                    <Search size={18} />
                    <span>Search</span>
                  </button>
                  
                  <button className="sidebar-item w-full">
                    <Zap size={18} />
                    <span>AI Suggestions</span>
                  </button>
                  
                  <button className="sidebar-item w-full">
                    <PanelLeft size={18} />
                    <span>Collapse All</span>
                  </button>
                  
                  <button className="sidebar-item w-full text-danger-500" onClick={clearAll}>
                    <Trash size={18} />
                    <span>Clear Canvas</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="sidebar-icons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center space-y-4 pt-4"
              >
                <button className="p-2 rounded-lg bg-primary-500/20 text-primary-600 dark:text-primary-400" onClick={handleAddMainNode}>
                  <Plus size={20} />
                </button>
                
                <button className="p-2 rounded-lg hover:bg-surface-dark/10 dark:hover:bg-surface-light/10">
                  <Search size={20} />
                </button>
                
                <button className="p-2 rounded-lg hover:bg-surface-dark/10 dark:hover:bg-surface-light/10">
                  <Zap size={20} />
                </button>
                
                <button className="p-2 rounded-lg hover:bg-surface-dark/10 dark:hover:bg-surface-light/10">
                  <PanelLeft size={20} />
                </button>
                
                <button className="p-2 rounded-lg text-danger-500 hover:bg-danger-500/10" onClick={clearAll}>
                  <Trash size={20} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;