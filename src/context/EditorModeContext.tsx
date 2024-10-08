'use client';

// tracks the reader v. instructor mode

import { createContext, useState, useCallback, useEffect } from 'react';
import { getStoredValue, storeValue } from '@/utils/localStorage';

interface EditorModeContextType {
  isInstructor: boolean;
  toggleMode: () => void;
  allMCQsFinalized: boolean;
  setAllMCQsFinalized: (finalized: boolean) => void;
}

export const EditorModeContext = createContext<EditorModeContextType>({
  isInstructor: true,
  toggleMode: () => {},
  allMCQsFinalized: true,
  setAllMCQsFinalized: () => {},
});

export const EditorModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInstructor, setIsInstructor] = useState<boolean>(true);
  const [allMCQsFinalized, setAllMCQsFinalized] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // locally save the state of isInstructor such that when we reload it does not reset
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = getStoredValue('isInstructor', true);
      setIsInstructor(savedMode);
      setIsMounted(true);
    }
  }, []);

  // persist to local storage on change
  useEffect(() => {
    if (typeof window !== 'undefined' && isMounted) {
      storeValue('isInstructor', isInstructor);
    }
  }, [isInstructor, isMounted]);

  const toggleMode = useCallback(() => {
    if (allMCQsFinalized) {
      setIsInstructor((prev) => !prev);
    }
  }, [allMCQsFinalized]);

  if (!isMounted) {
    return null;
  }

  return (
    <EditorModeContext.Provider
      value={{
        isInstructor,
        toggleMode,
        allMCQsFinalized,
        setAllMCQsFinalized,
      }}
    >
      {children}
    </EditorModeContext.Provider>
  );
};
