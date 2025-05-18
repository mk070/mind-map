import React, { useState,useRef  } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Search, 
  Zap, 
  Trash, 
  PanelLeft, 
  HelpCircle, 
  Settings, 
  ChevronDown, 
  ChevronUp,
  X
} from 'lucide-react'; 
import { cn } from '../../utils/helpers';
import { useSettingsStore } from '../../store/settingsStore';
import { useMindMap } from '../../context/MindMapContext';

const Sidebar = () => {
  const { sidebarOpen, toggleSidebar, animationsEnabled, toggleAnimations } = useSettingsStore();
  const { 
    addNode, 
    clearAll, 
    searchQuery, 
    setSearchQuery, 
    searchNodes, 
    searchResults, 
    currentResultIndex, 
    navigateToResult,
    resetSearch 
  } = useMindMap();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchNodes(query);
  };
  
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    } else {
      resetSearch();
    }
  };
  const [bottomPanelOpen, setBottomPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('help'); // 'help' or 'settings'
  
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
                  
                  <div className="relative">
                    <button 
                      className={`sidebar-item w-full ${isSearchOpen ? 'bg-surface-100 dark:bg-surface-800' : ''}`}
                      onClick={toggleSearch}
                    >
                      <Search size={18} />
                      <span>Search</span>
                    </button>
                    
                    {isSearchOpen && (
                      <div className="search-dropdown">
                        <div className="relative">
                          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                          <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search nodes..."
                            className="w-full pl-10 pr-8 py-2 bg-surface-100 dark:bg-surface-800 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            autoComplete="off"
                          />
                          {searchQuery && (
                            <button 
                              onClick={() => {
                                setSearchQuery('');
                                searchInputRef.current?.focus();
                              }}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                        
                        {searchResults.length > 0 && (
                          <div className="sticky top-0 bg-surface-50 dark:bg-surface-900 pt-1 pb-2 px-2 mb-1 border-b border-surface-100 dark:border-surface-700">
                            <div className="text-xs text-surface-500 dark:text-surface-400 flex items-center justify-between">
                              <span>{searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found</span>
                              <div className="flex items-center space-x-1">
                                <button 
                                  onClick={() => navigateToResult(-1)}
                                  className="p-1 rounded hover:bg-surface-200 dark:hover:bg-surface-700"
                                  title="Previous (Shift+Enter)"
                                >
                                  <ChevronUp size={14} />
                                </button>
                                <span>{currentResultIndex + 1} / {searchResults.length}</span>
                                <button 
                                  onClick={() => navigateToResult(1)}
                                  className="p-1 rounded hover:bg-surface-200 dark:hover:bg-surface-700"
                                  title="Next (Enter)"
                                >
                                  <ChevronDown size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {searchQuery && searchResults.length === 0 && (
                          <div className="mt-2 text-sm text-surface-500 dark:text-surface-400 text-center py-2">
                            No results found
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  
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
                {/* Bottom area - help and settings */}
                <div className="mt-auto border-t border-surface-dark/10 dark:border-surface-light/10 pt-2">
                  <div className="flex items-center justify-between px-2.5 py-1.5">
                    <div className="flex space-x-1">
                      <button 
                        className={cn(
                          'p-1.5 rounded-md text-xs font-medium',
                          activeTab === 'help' 
                            ? 'text-primary-600 dark:text-primary-400 bg-primary-500/10' 
                            : 'text-surface-foreground/60 hover:bg-surface-dark/5 dark:hover:bg-surface-light/5'
                        )}
                        onClick={() => setActiveTab('help')}
                      >
                        <HelpCircle size={16} />
                      </button>
                      <button 
                        className={cn(
                          'p-1.5 rounded-md text-xs font-medium',
                          activeTab === 'settings' 
                            ? 'text-primary-600 dark:text-primary-400 bg-primary-500/10' 
                            : 'text-surface-foreground/60 hover:bg-surface-dark/5 dark:hover:bg-surface-light/5'
                        )}
                        onClick={() => setActiveTab('settings')}
                      >
                        <Settings size={16} />
                      </button>
                    </div>
                    <button 
                      onClick={() => setBottomPanelOpen(!bottomPanelOpen)}
                      className="text-surface-foreground/50 hover:text-surface-foreground/80 p-1"
                    >
                      {bottomPanelOpen ?  <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {bottomPanelOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        {activeTab === 'help' ? (
                          <div className="px-2.5 py-2 text-xs text-surface-foreground/60">
                            <h4 className="font-medium text-base text-surface-dark/60 dark:text-surface-light/60  mb-2">Keyboard Shortcuts</h4>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span>Add Main Node</span>
                                <kbd className="px-1.5 py-0.5 text-xs bg-surface-dark/5 dark:bg-surface-light/5 rounded">N</kbd>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Delete Node</span>
                                <kbd className="px-1.5 py-0.5 text-xs bg-surface-dark/5 dark:bg-surface-light/5 rounded">Del</kbd>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Add Child Node</span>
                                <kbd className="px-1.5 py-0.5 text-xs bg-surface-dark/5 dark:bg-surface-light/5 rounded">Tab</kbd>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Search</span>
                                <kbd className="px-1.5 py-0.5 text-xs bg-surface-dark/5 dark:bg-surface-light/5 rounded">⌘K</kbd>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="px-2.5 py-2 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium">Animations</span>
                              <button
                                onClick={toggleAnimations}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                  animationsEnabled ? 'bg-primary-500' : 'bg-surface-dark/10 dark:bg-surface-light/10'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    animationsEnabled ? 'translate-x-5' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>
                            <div className="text-xs text-surface-foreground/60">
                              <p>Toggle animations on/off for better performance on large maps.</p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
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