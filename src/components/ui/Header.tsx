"use client";
import React, { useContext } from "react";
import { EditorModeContext } from "@/context/EditorModeContext"; // Import context

const Header: React.FC = () => {
  const { isInstructor, toggleMode } = useContext(EditorModeContext); // Use context for toggle
  return (
    <header className="w-full fixed top-0 flex justify-between items-center bg-white border-b border-gray-700 h-12 px-4 z-50">
      <div className="flex-1">
        <button
          onClick={toggleMode}
          className={`px-4 py-2 rounded ${
            isInstructor ? "bg-blue-500" : "bg-orange-500"
          }`}
        >
          {isInstructor ? "Instructor Mode" : "Reader Mode"}
        </button>
      </div>
    </header>
  );
};

export default Header;
