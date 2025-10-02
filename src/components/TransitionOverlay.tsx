import React from 'react';
import { motion } from 'framer-motion';

interface TransitionOverlayProps {
  isVisible: boolean;
}

const TransitionOverlay: React.FC<TransitionOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <motion.div 
      className="transition-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="transition-overlay__container">
        <motion.svg 
          width="150" 
          height="140" 
          viewBox="0 0 50 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <path d="M16.5 2.5h21.08L22.083 25.473H1z" fill="#6ED5FB"/>
          <path d="M17.422 27.602 11.42 36.5h22.082L49 13.527H32.702l-9.496 14.075z" fill="#2A769B"/>
        </motion.svg>
      </div>
    </motion.div>
  );
};

export default TransitionOverlay;
