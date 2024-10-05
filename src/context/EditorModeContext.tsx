"use client";
import { createContext, useState } from "react";

export const EditorModeContext = createContext({
  isInstructor: true, // default to instructor mode
  toggleMode: () => {},
});

export const EditorModeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isInstructor, setIsInstructor] = useState(true);

  const toggleMode = () => {
    setIsInstructor((prev) => !prev);
  };

  return (
    <EditorModeContext.Provider value={{ isInstructor, toggleMode }}>
      {children}
    </EditorModeContext.Provider>
  );
};
