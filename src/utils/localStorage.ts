// this is for tracking the toggle state and persisting it

// retrieve the state
export function getStoredValue<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;

  const storedValue = localStorage.getItem(key);
  if (storedValue !== null) {
    try {
      return JSON.parse(storedValue) as T;
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      return defaultValue;
    }
  }
  return defaultValue;
}

// set the state
export function storeValue<T>(key: string, value: T): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
    }
  }
}
