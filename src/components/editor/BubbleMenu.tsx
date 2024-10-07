import React from "react";
import { BubbleMenu as TipTapBubbleMenu, Editor } from "@tiptap/react";
import { FormatCommand } from "@/types";

type ButtonProps = {
  name: string;
  icon: JSX.Element;
  onClick: () => void;
};

const FormatButton: React.FC<ButtonProps> = ({ name, icon, onClick }) => (
  <button
    key={name}
    className="btn btn-sm btn-circle p-0 transition-colors duration-150 bg-secondary text-neutral-content hover:bg-neutral-focus"
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
  return (
    <TipTapBubbleMenu
      pluginKey="bubbleMenuText"
      className="flex items-center gap-2 p-2 rounded-lg bg-base-200 shadow-md"
      tippyOptions={{ duration: 150 }}
      editor={editor}
    >
      {buttons.map(({ name, icon, format, options }) => (
        <FormatButton
          key={name}
          name={name}
          icon={icon}
          onClick={() => toggleFormatting(format, options)}
        />
      ))}
    </TipTapBubbleMenu>
  );
};

export default BubbleMenu;
