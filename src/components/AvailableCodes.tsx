import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AvailableCodesProps {
  codes: { [key: string]: string };
  title?: string;
  showInConsole?: boolean;
}

const AvailableCodes: React.FC<AvailableCodesProps> = ({ 
  codes, 
  title = "Доступные тестовые данные", 
  showInConsole = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    if (showInConsole) {
      Object.entries(codes).forEach(([phone, code]) => {
      });
    }
  }, [codes, title, showInConsole]);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="available-codes">
      <button 
        className="available-codes__toggle"
        onClick={toggleVisibility}
        type="button"
      >
        {isVisible ? 'Скрыть' : 'Показать'} доступные тестовые данные
      </button>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="available-codes__content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="available-codes__list">
              {Object.entries(codes).map(([phone, code], index) => (
                <motion.div
                  key={phone}
                  className="available-codes__item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.1,
                    ease: 'easeOut'
                  }}
                >
                  <span className="available-codes__phone">{phone}</span>
                  <span className="available-codes__arrow">→</span>
                  <span className="available-codes__code">{code}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AvailableCodes;
