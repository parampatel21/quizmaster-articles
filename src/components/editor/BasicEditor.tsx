"use client";
import React, { useCallback } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Link from "@tiptap/extension-link";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code-block";
import Heading from "@tiptap/extension-heading";
import History from "@tiptap/extension-history";
import Dropcursor from "@tiptap/extension-dropcursor";
import * as Icons from "../ui/Icons";
import CommandsPlugin from "../../extensions/commands/CommandsPlugin";
import BubbleMenu from "./BubbleMenu"; // Import the BubbleMenu component
import { FormatCommand } from "@/types";

export function BasicEditor() {
  const editor = useEditor({
    extensions: [
      Document,
      History,
      Paragraph,
      Text,
      Link.configure({ openOnClick: false }),
      Bold,
      Underline,
      Italic,
      Strike,
      CommandsPlugin,
      Code,
      Dropcursor.configure({ color: "black", width: 2 }),
      Heading.configure({ levels: [1, 2, 3] }),
    ],
    content: "<h1>Hi there!</h1>",
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

  const buttons = [
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
  ];

  return (
    <div className="relative w-full mt-4 mb-12 bg-transparent">
      <BubbleMenu
        editor={editor}
        buttons={buttons}
        toggleFormatting={toggleFormatting}
      />
      <EditorContent editor={editor} />
    </div>
  );
}
