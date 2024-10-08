// under the hood of the Commands Menu plugin I made
// inspired by: https://vikramthyagarajan.medium.com/how-to-build-a-notion-like-text-editor-in-react-and-tiptap-7f394c36ed9d
// MCQ actually required some diff method to insert into editor

import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import CommandsList from './CommandsList';
import { Editor, Range } from '@tiptap/core';
import * as Icons from '@/components/ui/Icons';
import { CommandItem } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const commandItems: CommandItem[] = [
  {
    title: 'Heading 1',
    icon: <Icons.Heading1 />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 1 })
        .run();
    },
  },
  {
    title: 'Heading 2',
    icon: <Icons.Heading2 />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 2 })
        .run();
    },
  },
  {
    title: 'MCQ Question',
    icon: <Icons.ListTodo />,
    command: ({ editor, range }) => {
      const uniqueId = uuidv4();

      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContentAt(range, {
          type: 'mcq',
          attrs: {
            id: uniqueId,
            question: '',
            answers: [],
            isFinalized: false,
            selectedAnswer: null,
            showHintButton: true,
          },
        })
        .run();
    },
  },
  {
    title: 'Image',
    icon: <Icons.Image />,
    command: async ({ editor, range }) => {
      const imageUrl = window.prompt('Enter the image URL');
      if (imageUrl) {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setImage({ src: imageUrl })
          .run();
      }
    },
  },
];

const CommandsPlugin = Extension.create({
  name: 'commands',

  addOptions() {
    return {
      suggestion: {
        char: '/',
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
          return commandItems
            .filter((item) =>
              item.title.toLowerCase().startsWith(query.toLowerCase())
            )
            .slice(0, 10);
        },
        render: () => {
          let component: ReactRenderer;
          let popup: ReturnType<typeof tippy>;

          return {
            onStart: (props) => {
              component = new ReactRenderer(CommandsList, {
                props,
                editor: props.editor,
              });

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect as () => DOMRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              });
            },
            onUpdate(props) {
              component.updateProps(props);
              popup[0]?.setProps({
                getReferenceClientRect: props.clientRect as () => DOMRect,
              });
            },
            onExit() {
              popup[0]?.destroy();
              component.destroy();
            },
          };
        },
      }),
    ];
  },
});

export default CommandsPlugin;
