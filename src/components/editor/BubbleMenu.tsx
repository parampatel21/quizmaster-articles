import React, { useState } from "react";
import { BubbleMenu as TipTapBubbleMenu, Editor } from "@tiptap/react";
import { FormatCommand } from "@/types";

type ButtonProps = {
  name: string;
  icon: JSX.Element;
  format: FormatCommand;
  options?: Record<string, unknown>;
  isActive: boolean;
  isSelected: boolean;
  onClick: () => void;
};

const FormatButton: React.FC<ButtonProps> = ({
  name,
  icon,
  isActive,
  isSelected,
  format, // Add this prop
  onClick,
}) => (
  <button
    key={name}
    className={`flex justify-center items-center w-8 h-8 p-0 rounded transition-colors duration-150 ${
      isActive || (isSelected && format !== "toggleHeading") // Disable highlight for H1/H2
        ? "bg-blue-500 text-white"
        : "hover:bg-gray-700 text-gray-300"
    }`}
    onClick={onClick}
  >
    {icon}
  </button>
);

type BubbleMenuProps = {
  editor: Editor;
  buttons: {
    name: string;
    icon: JSX.Element;
    format: FormatCommand;
    options?: Record<string, unknown>;
  }[];
  toggleFormatting: (
    format: FormatCommand,
    options?: Record<string, unknown>
  ) => void;
};

const BubbleMenu: React.FC<BubbleMenuProps> = ({
  editor,
  buttons,
  toggleFormatting,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<FormatCommand | null>(
    null
  );

  const handleButtonClick = (
    format: FormatCommand,
    options?: Record<string, unknown>
  ) => {
    toggleFormatting(format, options);

    // Toggle the selected format
    if (selectedFormat === format) {
      setSelectedFormat(null); // Deselect if the button was already selected
    } else {
      setSelectedFormat(format);
    }
  };

  return (
    <TipTapBubbleMenu
      pluginKey="bubbleMenuText"
      className="flex items-center gap-2 p-2 rounded-md bg-gray-800 text-white shadow-lg dark:bg-gray-700"
      tippyOptions={{ duration: 150 }}
      editor={editor}
      shouldShow={({ from, to }) => from !== to}
    >
      {buttons.map(({ name, icon, format, options }) => (
        <FormatButton
          key={name}
          name={name}
          icon={icon}
          format={format} // Pass the format to FormatButton
          options={options}
          isActive={editor.isActive(format.toLowerCase(), options)}
          isSelected={selectedFormat === format}
          onClick={() => handleButtonClick(format, options)}
        />
      ))}
    </TipTapBubbleMenu>
  );
};

export default BubbleMenu;
