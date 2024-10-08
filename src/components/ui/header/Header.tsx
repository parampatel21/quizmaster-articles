'use client';

// toolbar at top of screen

import React, { useContext, useState } from 'react';
import { EditorModeContext } from '@/context/EditorModeContext';
import { CircleHelp } from '@/components/ui/Icons';
import HelpMenu from './HelpMenu';

const Header: React.FC = () => {
  const { isInstructor, toggleMode, allMCQsFinalized } = useContext(EditorModeContext);
  const [isHelpVisible, setIsHelpVisible] = useState(false);

  const handleToggle = () => {
    if (allMCQsFinalized) {
      toggleMode();
    }
  };

  const toggleHelpMenu = () => {
    setIsHelpVisible((prev) => !prev);
  };

  return (
    <>
      <header className="w-full fixed top-0 flex justify-between items-center bg-base-100 border-b border-neutral h-12 px-4 z-50 shadow-md">
        <div className="flex items-center space-x-4">
          <button
            className="btn btn-sm btn-outline text-customBlue border-customBlue hover:bg-customBlue hover:text-white focus:bg-customBlue focus:text-white active:bg-customBlue"
            onClick={toggleHelpMenu}
            aria-label="Toggle Help Menu"
          >
            <CircleHelp className="w-5 h-5" /> Help
          </button>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">
            {isInstructor ? 'Instructor Mode' : 'Reader Mode'}
          </span>
          <div>
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={isInstructor}
                onChange={handleToggle}
                disabled={!allMCQsFinalized}
                aria-label="Toggle Instructor Mode"
              />
            </label>
          </div>
        </div>
      </header>

      {isHelpVisible && <HelpMenu isVisible={isHelpVisible} onClose={toggleHelpMenu} />}
    </>
  );
};

export default Header;
