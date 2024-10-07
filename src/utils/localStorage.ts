export const getStoredValue = (key: string, defaultValue: any) => {
  if (typeof window === "undefined") return defaultValue;

  const storedValue = localStorage.getItem(key);
  return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
};

export const storeValue = (key: string, value: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};
