import React from "react";

interface CommandItem {
  title: string;
  icon: JSX.Element;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  command: (props: { editor: any; range: any }) => void;
}

interface Props {
  items: CommandItem[];
  command: (item: CommandItem) => void;
}

const CommandsList: React.FC<Props> = ({ items, command }) => {
  return (
    <div className="flex flex-col bg-base-200 text-base-content rounded-md p-2 shadow-lg">
      {items.map((item, index) => (
        <button
          key={index}
          className="flex items-center gap-2 px-3 py-1 my-1 text-left rounded-lg transition-colors duration-150 hover:bg-base-300"
          onClick={() => command(item)}
        >
          <span className="text-sm">{item.icon}</span>
          <span className="text-sm">{item.title}</span>
        </button>
      ))}
    </div>
  );
};

export default CommandsList;
