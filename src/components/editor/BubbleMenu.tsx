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
  format,
  onClick,
}) => (
  <button
    key={name}
    className={`btn btn-sm btn-circle p-0 transition-colors duration-150 ${
      isActive || (isSelected && format !== "toggleHeading")
        ? "bg-primary text-primary-content" // Active state using corporate primary color
        : "bg-secondary text-neutral-content hover:bg-neutral-focus" // Inactive state using corporate neutral tones
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
      className="flex items-center gap-2 p-2 rounded-lg bg-base-200 shadow-md" // Updated to base-200 for a cleaner, corporate look
      tippyOptions={{ duration: 150 }}
      editor={editor}
      // Add the logic to hide the BubbleMenu for images
      shouldShow={({ editor, state }) => {
        const { selection } = state;
        const selectedNode = state.doc.nodeAt(selection.from);

        // If the selected node is an image, return false to hide the BubbleMenu
        if (selectedNode?.type.name === "image") {
          return false;
        }

        // Otherwise, show the BubbleMenu if text is selected
        return selection.from !== selection.to;
      }}
    >
      {buttons.map(({ name, icon, format, options }) => (
        <FormatButton
          key={name}
          name={name}
          icon={icon}
          format={format}
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
