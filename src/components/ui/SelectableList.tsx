import type { MutableRefObject, VFC } from 'react';
import { useState } from 'react';

import { cx } from '@/features/utils/cx';

type SelectableListProps = {
  id: string;
  items: Record<string, string>;
  selectedItem: MutableRefObject<string | null>;
};

export const SelectableList: VFC<SelectableListProps> = ({ id, items, selectedItem }) => {
  const [currentSelectedItem, setCurrentSelectedItem] = useState<string | null>(selectedItem.current);

  return (
    <>
      <div className={cx('editor-scrollable scrollable-normal max-h-[30vh] space-y-1 overflow-y-scroll pr-4')}>
        {Object.keys(items).map((key) => {
          return (
            <div key={key}>
              <input
                type="radio"
                id={`${id}-${key}`}
                checked={selectedItem.current ? key === currentSelectedItem : false}
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
                className="inline-block h-full w-full cursor-pointer rounded-sm px-4 py-1 transition-colors duration-200 hover:bg-black/5 peer-checked:bg-black/5 peer-checked:hover:bg-black/10 dark:hover:bg-white/10 dark:peer-checked:bg-white/10 peer-checked:dark:hover:bg-white/20"
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
