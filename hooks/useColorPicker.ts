import { useCallback, useState } from 'react';

export const useColorPicker = () => {
  const [isVisible, setIsVisible] = useState(false);

  const openPicker = useCallback(() => setIsVisible(true), []);
  const closePicker = useCallback(() => setIsVisible(false), []);

  return {
    isVisible,
    openPicker,
    closePicker,
  };
};
