"use client";
import { createContext, useState, useCallback, useEffect } from "react";
import { getStoredValue, storeValue } from "@/utils/localStorage";

interface EditorModeContextType {
  isInstructor: boolean;
  toggleMode: () => void;
  allMCQsFinalized: boolean;
  setAllMCQsFinalized: (finalized: boolean) => void;
}

export const EditorModeContext = createContext<EditorModeContextType>({
  isInstructor: true, // default to instructor mode
  toggleMode: () => {},
  allMCQsFinalized: true,
  setAllMCQsFinalized: () => {},
});

export const EditorModeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isInstructor, setIsInstructor] = useState<boolean>(true); // Default to true initially
  const [allMCQsFinalized, setAllMCQsFinalized] = useState(true);
  const [isMounted, setIsMounted] = useState(false); // Track if component has mounted

  // On mount, retrieve the mode from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMode = getStoredValue("isInstructor", true);
      setIsInstructor(savedMode);
      setIsMounted(true); // Mark as mounted after setting the state
    }
  }, []);

  // Persist mode to localStorage whenever isInstructor changes
  useEffect(() => {
    if (typeof window !== "undefined" && isMounted) {
      storeValue("isInstructor", isInstructor);
    }
  }, [isInstructor, isMounted]);

  const toggleMode = useCallback(() => {
    if (allMCQsFinalized) {
      setIsInstructor((prev) => !prev);
    }
  }, [allMCQsFinalized]);

  // Render nothing until the component is mounted to avoid hydration errors
  if (!isMounted) {
    return null; // You can also return a loader if you want
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
