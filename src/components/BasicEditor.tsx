"use client"
import React, { useCallback, useState } from "react";
import classNames from "classnames";
import { useEditor, EditorContent, Editor, BubbleMenu } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Link from "@tiptap/extension-link";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from '@tiptap/extension-code-block'
import Heading from "@tiptap/extension-heading";  // Import the Heading extension
import History from "@tiptap/extension-history";
import Dropcursor from "@tiptap/extension-dropcursor"; 
import content from "./content";
import * as Icons from "./Icons"
import CommandsPlugin from "./CommandsPlugin";

export function BasicEditor() {
  const editor = useEditor({
    extensions: [
      Document,
      History,
      Paragraph,
      Text,
      Link.configure({
        openOnClick: false,
      }),
      Bold,
      Underline,
      Italic,
      Strike,
      CommandsPlugin,
      Code,
      Dropcursor.configure({ color: "black", width: 2 }),
      Heading.configure({ levels: [1, 2, 3] }), // Make sure to add Heading and configure levels
    ],
    content,
  }) as Editor;

  const toggleBold = useCallback(() => {
    editor.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor.chain().focus().toggleUnderline().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor.chain().focus().toggleStrike().run();
  }, [editor]);

  const toggleCode = useCallback(() => {
    editor.chain().focus().toggleCodeBlock().run();
  }, [editor]);

  const toggleH1 = useCallback(() => {
    editor.chain().focus().toggleHeading({ level: 1 }).run();
  }, [editor]);

  const toggleH2 = useCallback(() => {
    editor.chain().focus().toggleHeading({ level: 2 }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="editor w-full max-w-full bg-transparent">
      <BubbleMenu
        pluginKey="bubbleMenuText"
        className="bubble-menu-dark"
        tippyOptions={{ duration: 150 }}
        editor={editor}
        shouldShow={({ editor, view, state, oldState, from, to }) => {
          return from !== to;
        }}
      >
        {/* Bold Button */}
        <button
          className={classNames("menu-button", {
            "is-active": editor.isActive("bold")
          })}
          onClick={toggleBold}
        >
          <Icons.Bold />
        </button>
        
        {/* Underline Button */}
        <button
          className={classNames("menu-button", {
            "is-active": editor.isActive("underline")
          })}
          onClick={toggleUnderline}
        >
          <Icons.Underline />
        </button>
        
        {/* Italic Button */}
        <button
          className={classNames("menu-button", {
            "is-active": editor.isActive("italic")
          })}
          onClick={toggleItalic}
        >
          <Icons.Italic />
        </button>
        
        {/* Strike Button */}
        <button
          className={classNames("menu-button", {
            "is-active": editor.isActive("strike")
          })}
          onClick={toggleStrike}
        >
          <Icons.Strikethrough />
        </button>
        
        {/* Code Button */}
        <button
          className={classNames("menu-button", {
            "is-active": editor.isActive("code")
          })}
          onClick={toggleCode}
        >
          <Icons.Code />
        </button>

        {/* H1 Button */}
        <button
          className={classNames("menu-button", {
            "is-active": editor.isActive("heading", { level: 1 })
          })}
          onClick={toggleH1}
        >
          H1
        </button>

        {/* H2 Button */}
        <button
          className={classNames("menu-button", {
            "is-active": editor.isActive("heading", { level: 2 })
          })}
          onClick={toggleH2}
        >
          H2
        </button>
      </BubbleMenu>

      <EditorContent editor={editor} />
    </div>
  );
}
