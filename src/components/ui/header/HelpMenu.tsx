// some static text explaining how to use the app

import React, { useState, useEffect } from 'react';
import { X } from '@/components/ui/Icons';

interface HelpMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

const HelpMenu: React.FC<HelpMenuProps> = ({ isVisible, onClose }) => {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      // Delay to trigger the CSS transition
      setTimeout(() => setIsMenuVisible(true), 50);
    } else {
      setIsMenuVisible(false);
      // Wait for the transition to complete before unmounting
      setTimeout(() => setShouldRender(false), 300); // Match with CSS transition duration
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed top-16 left-3 w-1/4 h-auto max-h-[70vh] border-dashed border-blue-400 border-2 shadow-lg z-50 pb-4 px-4 rounded-md flex flex-col transition-opacity duration-300 ease-in-out bg-base-100 ${
        isMenuVisible ? 'opacity-100' : 'opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-menu-title"
    >
      <div className="flex justify-between items-center">
        <h2 id="help-menu-title" className="text-lg font-bold leading-none">
          How to use this app:
        </h2>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800"
          aria-label="Close Help Menu"
        >
          <X className="w-6 h-6 mt-2" />
        </button>
      </div>
      <div className="overflow-y-auto flex-grow">
        <p className="text-sm text-gray-600 mb-4">
          This app is designed to help instructors create interactive articles for readers.
        </p>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
          <li>
            <span className="font-bold">Switch Modes:</span> Use the toggle on the top right to
            switch between Instructor Mode (for editing) and Reader Mode (for viewing).
          </li>
          <li>
            <span className="font-bold">Command Menu:</span> In Instructor Mode, you can add
            questions, images, headings, and more through the commands menu by typing “/”.
          </li>
          <li>
            <span className="font-bold">Multiple Choice Questions:</span> Instructors can create
            MCQs, edit answer choices, and set a correct answer. In Reader Mode, participants can
            answer questions but not make changes.
          </li>
          <li>
            <span className="font-bold">Smart Hint:</span> In Instructor Mode, you can enable the
            AI-powered Smart Hint option for each question, which provides hints for readers when
            they get stuck.
          </li>
          <li>
            <span className="font-bold">Bubble Menu:</span> Highlighting any text as an instructor
            will allow you to apply additional styles via a floating menu.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default React.memo(HelpMenu);
