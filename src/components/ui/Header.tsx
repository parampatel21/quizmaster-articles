"use client";
import React, { useContext } from "react";
import { EditorModeContext } from "@/context/EditorModeContext"; // Import context

const Header: React.FC = () => {
  const { isInstructor, toggleMode } = useContext(EditorModeContext); // Use context for toggle

  return (
    <header className="w-full fixed top-0 flex justify-between items-center bg-base-100 border-b border-neutral h-12 px-4 z-50 shadow-md">
      <div className="flex-1"></div> {/* Empty space for left alignment */}

      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">{isInstructor ? "Instructor Mode" : "Reader Mode"}</span>
        <label className="label cursor-pointer">
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={isInstructor}
            onChange={toggleMode}
          />
        </label>
      </div>
    </header>
  );
};

export default Header;
