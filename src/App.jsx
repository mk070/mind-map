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
  name: "connectionDraw",
  effect: (targets, config) => {
    // Get the total length of the path
    const length = targets.getTotalLength();
    
    // Create a natural-looking drawing effect
    return gsap.from(targets, {
      attr: { 
        d: (i, target) => {
          const d = target.getAttribute("d");
          const startPoint = d.split(" ")[1]; // Get first point
          return `M ${startPoint} ${startPoint}`; 
        },
        // Add stroke dasharray for drawing effect
        strokeDasharray: `${length} ${length}`,
        strokeDashoffset: length,
        // Add some variation to stroke width for a more natural look
        strokeWidth: 1.5
      },
      duration: config.duration || 0.4,
      ease: "power2.inOut",
      onComplete: () => {
        // Clean up after animation
        targets.removeAttribute("stroke-dasharray");
        targets.removeAttribute("stroke-dashoffset");
        targets.removeAttribute("strokeWidth");
      },
      // Add some natural movement during drawing
      modifiers: {
        strokeWidth: (value) => {
          return gsap.utils.interpolate(1.5, 2, gsap.utils.normalize(0, 1, gsap.utils.random(0.3, 0.7)));
        }
      }
    });
  },
  defaults: { duration: 0.4 },
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