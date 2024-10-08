"use client";
import React, { useContext, useState } from "react";
import { EditorModeContext } from "@/context/EditorModeContext";
import * as Icons from "@/components/ui/Icons";

const Header: React.FC = () => {
  const { isInstructor, toggleMode, allMCQsFinalized } =
    useContext(EditorModeContext);
  const [showHelp, setShowHelp] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleToggle = () => {
    if (allMCQsFinalized) {
      toggleMode();
    }
  };

  const toggleHelp = () => {
    if (!showHelp) {
      setShowHelp(true); // Show the help content
      setTimeout(() => setIsVisible(true), 50); // Trigger the fade-in effect after a short delay
    } else {
      setIsVisible(false); // Start fade-out effect
      setTimeout(() => setShowHelp(false), 300); // Delay removing the content to match transition duration
    }
  };

  return (
    <>
      <header className="w-full fixed top-0 flex justify-between items-center bg-base-100 border-b border-neutral h-12 px-4 z-50 shadow-md">
        <div className="flex items-center space-x-4">
          <button
            className="btn btn-sm btn-outline text-customBlue border-customBlue hover:bg-customBlue hover:text-white focus:bg-customBlue focus:text-white active:bg-customBlue"
            onClick={toggleHelp}
          >
            <Icons.CircleHelp className="w-5 h-5" /> Help
          </button>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">
            {isInstructor ? "Instructor Mode" : "Reader Mode"}
          </span>
          <div>
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                className={`toggle toggle-primary`}
                checked={isInstructor}
                onChange={handleToggle}
                disabled={!allMCQsFinalized}
              />
            </label>
          </div>
        </div>
      </header>

      {/* Help Menu with transition */}
      {showHelp && (
        <div
          className={`fixed top-16 left-3 w-1/4 h-auto max-h-[70vh] border-dashed border-blue-400 border-2 shadow-lg z-50 pb-4 px-4 rounded-md flex flex-col transition-opacity duration-300 ease-in-out bg-base-100 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold leading-none">
              How to use this app:
            </h2>
            <button
              onClick={toggleHelp}
              className="text-gray-600 hover:text-gray-800"
            >
              <Icons.X className="w-6 h-6 mt-2" />
            </button>
          </div>
          <div className="overflow-y-auto flex-grow">
            <p className="text-sm text-gray-600 mb-4">
              This app is designed to help instructors create interactive
              articles for readers.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600">
              <li>
                <span className="font-bold">Switch Modes:</span> Use the toggle
                on the top right to switch between Instructor Mode (for editing)
                and Reader Mode (for viewing).
              </li>
              <li>
                <span className="font-bold">Command Menu:</span> In Instructor
                Mode, you can add questions, images, headings, and more through
                the commands menu by typing “/”.
              </li>
              <li>
                <span className="font-bold">Multiple Choice Questions:</span>{" "}
                Instructors can create MCQs, edit answer choices, and set a
                correct answer. In Reader Mode, participants can answer
                questions but not make changes.
              </li>
              <li>
                <span className="font-bold">Smart Hint:</span> In Instructor
                Mode, you can enable the AI-powered Smart Hint option for each
                question, which provides hints for readers when they get stuck.
              </li>
              <li>
                <span className="font-bold">Bubble Menu:</span> Highlighting any
                text as an instructor will allow you to apply additional styles
                via a floating menu.
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
