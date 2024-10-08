import React from "react";
import { CommandItem } from "@/types";

const CommandsList: React.FC<{
  items: CommandItem[];
  command: (item: CommandItem) => void;
}> = ({ items, command }) => (
  <div className="flex flex-col bg-base-200 text-base-content rounded-md p-2 shadow-lg">
    {items.map((item) => (
      <button
        key={item.title}
        className="flex items-center gap-2 px-3 py-1 my-1 text-left rounded-lg transition-colors duration-150 hover:bg-base-300"
        onClick={() => command(item)}
      >
        <span className="text-sm">{item.icon}</span>
        <span className="text-sm">{item.title}</span>
      </button>
    ))}
  </div>
);

export default CommandsList;
