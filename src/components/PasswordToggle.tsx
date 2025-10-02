import React from 'react';

interface PasswordToggleProps {
  isVisible: boolean;
  onToggle: () => void;
  className?: string;
}

const PasswordToggle: React.FC<PasswordToggleProps> = ({ isVisible, onToggle, className = '' }) => {
  return (
    <button
      type="button"
      className={`password-toggle ${className}`}
      onClick={onToggle}
      aria-label={isVisible ? 'Скрыть пароль' : 'Показать пароль'}
    >
      {isVisible ? (
        <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0" fill="currentColor"/>
          <path d="M19.894 6.553C17.736 2.236 13.904 0 10 0S2.264 2.236.106 6.553a1 1 0 0 0 0 .894C2.264 11.764 6.096 14 10 14s7.736-2.236 9.894-6.553a1 1 0 0 0 0-.894M10 12c-2.969 0-6.002-1.62-7.87-5C3.998 3.62 7.03 2 10 2s6.002 1.62 7.87 5c-1.868 3.38-4.901 5-7.87 5" fill="currentColor"/>
        </svg>
      ) : (
        <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.707.293a1 1 0 0 0-1.414 1.414l2.424 2.424C2.287 5.207 1.04 6.685.106 8.553a1 1 0 0 0 0 .894C2.264 13.764 6.096 16 10 16c1.555 0 3.1-.355 4.53-1.055l2.763 2.762a1 1 0 0 0 1.414-1.414zm10.307 13.135c-.98.383-2 .572-3.014.572-2.969 0-6.002-1.62-7.87-5 .817-1.479 1.858-2.62 3.018-3.437l2.144 2.144a3 3 0 0 0 4.001 4.001zm3.538-2.532c.483-.556.926-1.187 1.318-1.896-1.868-3.38-4.9-5-7.87-5q-.168 0-.336.007L7.879 2.223A10.2 10.2 0 0 1 10 2c3.903 0 7.736 2.236 9.894 6.553a1 1 0 0 1 0 .894 13 13 0 0 1-1.925 2.865z" fill="currentColor"/>
        </svg>
      )}
    </button>
  );
};

export default PasswordToggle;
