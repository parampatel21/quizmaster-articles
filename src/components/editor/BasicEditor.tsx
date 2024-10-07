"use client";
import React, { useCallback, useContext } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code-block";
import Heading from "@tiptap/extension-heading";
import History from "@tiptap/extension-history";
import Image from "@tiptap/extension-image";
import Dropcursor from "@tiptap/extension-dropcursor";
import * as Icons from "../ui/Icons";
import CommandsPlugin from "../extensions/commands/CommandsPlugin";
import BubbleMenu from "./BubbleMenu"; // Import the BubbleMenu component
import { FormatCommand } from "@/types";
import Highlight from "@tiptap/extension-highlight"; // Import Highlight extension
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { EditorModeContext } from "@/context/EditorModeContext";
import { MCQNode } from "../extensions/mcq/MCQNode";
import Gapcursor from "@tiptap/extension-gapcursor";
import { MCQSelectionProvider } from "@/context/MCQSelectionContext";

const ydoc = new Y.Doc();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const provider = new HocuspocusProvider({
  url: "ws://127.0.0.1",
  name: "document",
  document: ydoc,
});

export function BasicEditor() {
  const { isInstructor } = useContext(EditorModeContext);
  const editor = useEditor({
    editable: isInstructor,
    extensions: [
      MCQNode,
      Document,
      History,
      Paragraph,
      Text,
      Bold,
      Underline,
      Italic,
      Strike,
      CommandsPlugin,
      Code,
      Heading.configure({ levels: [1, 2, 3] }),
      Highlight,
      Image,
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider,
      }),
      Gapcursor,
      Dropcursor,
    ],
    immediatelyRender: false,
  }) as Editor;

  const toggleFormatting = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (format: FormatCommand, options?: any) => {
      if (editor && format in editor.chain().focus()) {
        editor.chain().focus()[format](options).run();
      }
    },
    [editor]
  );

  if (!editor) {
    return null;
  }

  const buttons = isInstructor
    ? [
        {
          name: "Bold",
          icon: <Icons.Bold />,
          format: "toggleBold" as FormatCommand,
        },
        {
          name: "Underline",
          icon: <Icons.Underline />,
          format: "toggleUnderline" as FormatCommand,
        },
        {
          name: "Italic",
          icon: <Icons.Italic />,
          format: "toggleItalic" as FormatCommand,
        },
        {
          name: "Strike",
          icon: <Icons.Strikethrough />,
          format: "toggleStrike" as FormatCommand,
        },
        {
          name: "Code",
          icon: <Icons.Code />,
          format: "toggleCodeBlock" as FormatCommand,
        },
        {
          name: "Heading1",
          icon: <Icons.Heading1 />,
          format: "toggleHeading" as FormatCommand,
          options: { level: 1 },
        },
        {
          name: "Heading2",
          icon: <Icons.Heading2 />,
          format: "toggleHeading" as FormatCommand,
          options: { level: 2 },
        },
      ]
    : [
        {
          name: "Highlighter",
          icon: <Icons.Highlighter />,
          format: "toggleHighlight" as FormatCommand,
        },
      ];

  return (
    <MCQSelectionProvider>
      <div className="relative w-full mt-4 mb-12">
        {editor && (
          <BubbleMenu
            editor={editor}
            buttons={buttons}
            toggleFormatting={toggleFormatting}
          />
        )}
        <EditorContent editor={editor} />
      </div>
    </MCQSelectionProvider>
  );
}
