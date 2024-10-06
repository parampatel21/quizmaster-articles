import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import MCQComponent from "./MCQComponent";
import { v4 as uuidv4 } from "uuid";

export const MCQNode = Node.create({
  name: "mcq",
  group: "block",
  content: "inline*",
  draggable: true,

  addAttributes() {
    return {
      question: {
        default: "",
      },
      answers: {
        default: [],
      },
      selectedAnswer: {
        default: null,
      },
      isFinalized: {
        default: false,
      },
      id: {
        default: () => uuidv4(),
      },
    };
  },

  parseHTML() {
    return [{ tag: "mcq" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "mcq" }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MCQComponent);
  },
});
