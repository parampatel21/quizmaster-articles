import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import MCQComponent from "./MCQComponent";

export const MCQNode = Node.create({
  name: 'mcq',
  group: 'block',
  content: 'inline*', // This allows any inline content or none, making it flexible.
  draggable: true,

  addAttributes() {
    return {
      question: {
        default: '',
      },
      answers: {
        default: [],
      },
      correctAnswer: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [{ tag: 'mcq' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'mcq' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MCQComponent);
  },
});
