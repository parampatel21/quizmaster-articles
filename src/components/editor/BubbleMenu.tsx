// the Bubble Menu appears when you highlight some text in Instructor mode

import React, { useCallback } from 'react';
import { BubbleMenu as TipTapBubbleMenu, Editor } from '@tiptap/react';
import * as Icons from '../ui/Icons';

type ButtonProps = {
  label: string;
  icon: JSX.Element;
  onClick: () => void;
};

type FormatCommand =
  | 'toggleBold'
  | 'toggleUnderline'
  | 'toggleItalic'
  | 'toggleStrike'
  | 'toggleCodeBlock'
  | 'toggleHeading'
  | 'toggleHighlight';

const FormatButton: React.FC<ButtonProps> = ({ icon, onClick }) => (
  <button
    className="btn btn-sm btn-circle p-0 transition-colors duration-150 bg-secondary text-neutral-content hover:bg-neutral-focus"
    onClick={onClick}
  >
    {icon}
  </button>
);

const buttons = [
  {
    label: 'Bold',
    icon: <Icons.Bold />,
    format: 'toggleBold' as FormatCommand,
  },
  {
    label: 'Underline',
    icon: <Icons.Underline />,
    format: 'toggleUnderline' as FormatCommand,
  },
  {
    label: 'Italic',
    icon: <Icons.Italic />,
    format: 'toggleItalic' as FormatCommand,
  },
  {
    label: 'Strike',
    icon: <Icons.Strikethrough />,
    format: 'toggleStrike' as FormatCommand,
  },
  {
    label: 'Code',
    icon: <Icons.Code />,
    format: 'toggleCodeBlock' as FormatCommand,
  },
  {
    label: 'Heading1',
    icon: <Icons.Heading1 />,
    format: 'toggleHeading' as FormatCommand,
    options: { level: 1 },
  },
  {
    label: 'Heading2',
    icon: <Icons.Heading2 />,
    format: 'toggleHeading' as FormatCommand,
    options: { level: 2 },
  },
  {
    label: 'Highlighter',
    icon: <Icons.Highlighter />,
    format: 'toggleHighlight' as FormatCommand,
  },
];

const BubbleMenu: React.FC<{ editor: Editor }> = ({ editor }) => {
  const toggleFormatting = useCallback(
    (format: FormatCommand, options?: Record<string, unknown>) => {
      if (editor && format in editor.chain().focus()) {
        editor.chain().focus()[format](options).run();
      }
    },
    [editor]
  );

  return (
    <TipTapBubbleMenu
      pluginKey="bubbleMenuText"
      className="flex items-center gap-2 p-2 rounded-lg bg-base-200 shadow-md"
      tippyOptions={{ duration: 150 }}
      editor={editor}
    >
      {buttons.map(({ label, icon, format, options }) => (
        <FormatButton
          key={label}
          label={label}
          icon={icon}
          onClick={() => toggleFormatting(format, options)}
        />
      ))}
    </TipTapBubbleMenu>
  );
};

export default BubbleMenu;
