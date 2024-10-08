"use client";
import React, { useContext } from "react";
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
import CommandsPlugin from "@/components/extensions/commands/CommandsPlugin";
import BubbleMenu from "@/components/editor/BubbleMenu";
import Highlight from "@tiptap/extension-highlight";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { EditorModeContext } from "@/context/EditorModeContext";
import { MCQNode } from "@/components/extensions/mcq";
import Gapcursor from "@tiptap/extension-gapcursor";
import { MCQSelectionProvider } from "@/context/MCQSelectionContext";

const ydoc = new Y.Doc();

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

  if (!editor) {
    return null;
  }

  return (
    <MCQSelectionProvider>
      <div className="relative w-full mt-4 mb-12">
        {editor && <BubbleMenu editor={editor} />}
        <EditorContent editor={editor} />
      </div>
    </MCQSelectionProvider>
  );
}
