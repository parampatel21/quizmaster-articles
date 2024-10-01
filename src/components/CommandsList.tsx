import React from 'react';

interface CommandItem {
  title: string;
  command: (props: { editor: any; range: any }) => void;
}

interface Props {
  items: CommandItem[];
  command: (item: CommandItem) => void;
}

const CommandsList: React.FC<Props> = ({ items, command }) => {
  return (
    <div className="command-list">
      {items.map((item, index) => (
        <button
          key={index}
          className="command-item"
          onClick={() => command(item)}
        >
          {item.title}
        </button>
      ))}
    </div>
  );
};

export default CommandsList;
