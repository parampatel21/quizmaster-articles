// a type I abstracted out for command menu

import { Editor, Range } from "@tiptap/core";
import { ReactNode } from "react";

export interface CommandItem {
  title: string;
  icon: ReactNode;
  command: (props: { editor: Editor; range: Range }) => void;
}
