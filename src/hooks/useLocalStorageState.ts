import { useState, useEffect } from "react";

// Custom hook to manage state with localStorage persistence.
function useLocalStorageState<T>(
  key: string, // The key under which the value is stored in localStorage.
  defaultValue: T | (() => T) // The default value if nothing is found in localStorage. Can be a value or a function that returns the value.
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // 1. Try to get the value from localStorage.
  // 2. If not found, or if parsing fails, use the defaultValue.
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue !== null) {
        return JSON.parse(storedValue) as T;
      }
    } catch (error) {
      // Log error if parsing fails, but still proceed with defaultValue.
      console.error(`Error parsing localStorage key "${key}":`, error);
    }
    // If defaultValue is a function, call it to get the initial value. Otherwise, use it directly.
    return typeof defaultValue === "function"
      ? (defaultValue as () => T)()
      : defaultValue;
  });

  useEffect(() => {
    try {
      // Convert state to JSON string and save to localStorage.
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      // Log error if saving fails (e.g., localStorage is full).
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}

export default useLocalStorageState;
