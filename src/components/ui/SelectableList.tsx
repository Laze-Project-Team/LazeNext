import type { MutableRefObject, VFC } from 'react';
import { useState } from 'react';

type SelectableListProps = {
  id: string;
  items: Record<string, string>;
  selectedItem: MutableRefObject<string | null>;
};

export const SelectableList: VFC<SelectableListProps> = ({ id, items, selectedItem }) => {
  const [currentSelectedItem, setCurrentSelectedItem] = useState<string | null>(selectedItem.current);

  return (
    <>
      <div className="flex flex-col space-y-1">
        {Object.keys(items).map((key) => {
          return (
            <div key={key}>
              <input
                type="radio"
                id={`${id}-${key}`}
                checked={selectedItem.current ? selectedItem.current === currentSelectedItem : false}
                hidden
                className="peer"
                name={id}
                onChange={(e) => {
                  if (e.target.checked) {
                    selectedItem.current = key;
                    setCurrentSelectedItem(key);
                  }
                }}
              />
              <label
                htmlFor={`${id}-${key}`}
                className="inline-block px-4 py-1 w-full h-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-200 rounded-sm peer-checked:bg-black/5 dark:peer-checked:bg-white/10 peer-checked:hover:bg-black/10 peer-checked:dark:hover:bg-white/20 cursor-pointer"
              >
                {items[key as keyof typeof items]}
              </label>
            </div>
          );
        })}
      </div>
    </>
  );
};
