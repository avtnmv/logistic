import { useState } from 'react';

export const usePasswordToggle = (initialState: boolean = false) => {
  const [isVisible, setIsVisible] = useState(initialState);

  const toggle = () => setIsVisible(!isVisible);
  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);

  return {
    isVisible,
    toggle,
    show,
    hide
  };
};
