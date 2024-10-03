import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import MCQComponent from "./MCQComponent";

export const MCQNode = Node.create({
  name: "mcq",

  group: "block",

  content: "inline*",

  addAttributes() {
    return {
      question: {
        default: "",
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
    return [{ tag: "mcq" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["mcq", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MCQComponent); // The React component that will handle rendering
  },
});
