import { Extension } from "@tiptap/core";
import Suggestion, { SuggestionProps } from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import tippy, { Instance } from "tippy.js";
import CommandsList from "./CommandsList";
import { Editor } from "@tiptap/react";
import { Range } from "@tiptap/core";
import * as Icons from "@/components/ui/Icons"; // Import your icons

export interface CommandItem {
  title: string;
  icon: JSX.Element; // Include the icon in the CommandItem interface
  command: (props: { editor: Editor; range: Range }) => void;
}

const CommandsPlugin = Extension.create({
  name: "commands",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: CommandItem;
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion<CommandItem>({
        editor: this.editor,
        ...this.options.suggestion,
        items: ({ query }: { query: string }): CommandItem[] => {
          return [
            {
              title: "Heading 1",
              icon: <Icons.Heading1 />, // Use the H1 icon
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setNode("heading", { level: 1 })
                  .run();
              },
            },
            {
              title: "Heading 2",
              icon: <Icons.Heading2 />, // Use the H2 icon
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setNode("heading", { level: 2 })
                  .run();
              },
            },
          ]
            .filter((item) =>
              item.title.toLowerCase().startsWith(query.toLowerCase())
            )
            .slice(0, 10);
        },

        render: () => {
          let component: ReactRenderer;
          let popup: Instance[];

          return {
            onStart: (props: SuggestionProps<CommandItem>) => {
              component = new ReactRenderer(CommandsList, {
                props,
                editor: props.editor,
              });

              if (props.clientRect) {
                popup = tippy("body", {
                  getReferenceClientRect: props.clientRect as () => DOMRect,
                  appendTo: () => document.body,
                  content: component.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: "manual",
                  placement: "bottom-start",
                });
              }
            },
            onUpdate(props: SuggestionProps<CommandItem>) {
              component.updateProps(props);

              if (props.clientRect && popup) {
                popup[0].setProps({
                  getReferenceClientRect: props.clientRect as () => DOMRect,
                });
              }
            },
            onExit() {
              popup?.[0]?.destroy();
              component.destroy();
            },
          };
        },
      }),
    ];
  },
});

export default CommandsPlugin;
