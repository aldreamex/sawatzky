import { useCallback } from 'react';

export const useDebounce = (callback: Function, delay: number) => {
  const debouncedCallback = useCallback(
    (...args: any[]) => {
      let timeoutId: string | number | ReturnType<typeof setTimeout> = '';
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );

  return debouncedCallback;
};
