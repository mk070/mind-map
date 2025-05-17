import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useMindMap } from '../../context/MindMapContext';

const AddMainNodeButton = () => {
  const { addNode } = useMindMap();
  
  const handleAddMainNode = () => {
    // Add a node at the center of the viewport
    const x = window.innerWidth / 2 - 75; // Approximate half of node width
    const y = window.innerHeight / 2 - 25; // Approximate half of node height
    
    addNode({
      x,
      y,
      content: 'Main Idea',
    });
  };
  
  return (
    <motion.button 
      className="absolute left-1/2 bottom-4 transform -translate-x-1/2 btn-primary flex items-center gap-2 shadow-lg"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.4 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleAddMainNode}
    >
      <Plus size={20} />
      Add Main Node
    </motion.button>
  );
};

export default AddMainNodeButton;