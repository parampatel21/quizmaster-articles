import React from "react";

interface CommandItem {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  command: (props: { editor: any; range: any }) => void;
}

interface Props {
  items: CommandItem[];
  command: (item: CommandItem) => void;
}

const CommandsList: React.FC<Props> = ({ items, command }) => {
  return (
    <div className="flex flex-col bg-gray-100 dark:bg-gray-800 rounded-md p-2 shadow-lg">
      {items.map((item, index) => (
        <button
          key={index}
          className="px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-150"
          onClick={() => command(item)}
        >
          {item.title}
        </button>
      ))}
    </div>
  );
};

export default CommandsList;
