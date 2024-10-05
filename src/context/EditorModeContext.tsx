"use client";
import { createContext, useState, useCallback } from "react";

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
  const [isInstructor, setIsInstructor] = useState(true);
  const [allMCQsFinalized, setAllMCQsFinalized] = useState(true);

  const toggleMode = useCallback(() => {
    if (allMCQsFinalized) {
      setIsInstructor((prev) => !prev);
    }
  }, [allMCQsFinalized]);

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
