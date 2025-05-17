import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ThemeProvider } from './context/ThemeContext';
import { MindMapProvider } from './context/MindMapContext';
import TopBar from './components/layout/TopBar';
import Sidebar from './components/layout/Sidebar';
import Canvas from './components/mindmap/Canvas';
import AddMainNodeButton from './components/mindmap/AddMainNodeButton';
import SettingsModal from './components/ui/SettingsModal';
import { useSettingsStore } from './store/settingsStore';

function App() {
  const { showSettings } = useSettingsStore();

  // Register GSAP effects
  useEffect(() => {
    gsap.registerEffect({
      name: "nodeExpand",
      effect: (targets, config) => {
        return gsap.from(targets, {
          scale: 0.5,
          opacity: 0,
          duration: config.duration || 0.5,
          ease: "elastic.out(1, 0.5)",
          stagger: config.stagger || 0.1,
        });
      },
      defaults: { duration: 0.5, stagger: 0.1 },
      extendTimeline: true,
    });
    
    gsap.registerEffect({
  name: "connectionDraw",
  effect: (targets, config) => {
    return gsap.from(targets, {
      attr: { 
        d: (i, target) => {
          const d = target.getAttribute("d");
          const startPoint = d.split(" ")[1]; // Get first point
          return `M ${startPoint} ${startPoint}`; 
        }
      },
      strokeDashoffset: (i, target) => {
        const length = target.getTotalLength();
        return [length, 0];
      },
      strokeDasharray: (i, target) => {
        const length = target.getTotalLength();
        return [`${length} ${length}`, `${length} 0`];
      },
      duration: config.duration || 0.5,
      ease: "power2.inOut",
    });
  },
  defaults: { duration: 0.5 },
  extendTimeline: true,
});

  }, []);

  return (
    <ThemeProvider>
      <MindMapProvider>
        <div className="relative flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark">
          <motion.div 
            className="absolute inset-0 bg-grid-pattern-light dark:bg-grid-pattern bg-grid pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1, delay: 0.2 }}
          />
          
          <TopBar />
          
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <Canvas />
          </div>
          
          <AddMainNodeButton />
          
          {showSettings && <SettingsModal />}
        </div>
      </MindMapProvider>
    </ThemeProvider>
  );
}

export default App;