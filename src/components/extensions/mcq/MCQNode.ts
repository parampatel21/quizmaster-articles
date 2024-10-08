// components/extensions/mcq/MCQNode.ts

import { Node } from "@tiptap/core";
import MCQComponent from "./MCQComponent";
import { ReactNodeViewRenderer } from "@tiptap/react";

export const MCQNode = Node.create({
  name: "mcq",

  group: "block",

  atom: true,

  draggable: true,

  addAttributes() {
    return {
      id: { default: null },
      question: { default: "" },
      answers: { default: [] },
      isFinalized: { default: false },
      selectedAnswer: { default: null },
      showHintButton: { default: true },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-type='mcq']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { "data-type": "mcq", ...HTMLAttributes }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MCQComponent);
  },
});
