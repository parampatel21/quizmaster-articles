import React from "react";

interface CommandItem {
  title: string;
  icon: JSX.Element; // Add the icon property here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  command: (props: { editor: any; range: any }) => void;
}

interface Props {
  items: CommandItem[];
  command: (item: CommandItem) => void;
}

const CommandsList: React.FC<Props> = ({ items, command }) => {
  return (
    <div className="flex flex-col bg-gray-700 text-white rounded-md p-2 shadow-lg">
      {items.map((item, index) => (
        <button
          key={index}
          className="flex items-center gap-2 px-2 pr-10 py-1 my-0.5 text-left rounded transition-colors duration-150 hover:bg-gray-600"
          onClick={() => command(item)}
        >
          <span className="text-xs">{item.icon}</span>
          <span className="text-xs">{item.title}</span>{" "}
        </button>
      ))}
    </div>
  );
};

export default CommandsList;
