import { useTranslation } from 'next-i18next';
import type { MutableRefObject, VFC } from 'react';
import { useState } from 'react';
import { VscTrash } from 'react-icons/vsc';

import { cx } from '@/features/utils/cx';

export type SelectableListItem = {
  id: string;
  name: string;
  deletable?: boolean;
  editable?: boolean;
};

type SelectableListProps = {
  id: string;
  items: Record<string, SelectableListItem>;
  selectedItem: MutableRefObject<string | null>;
  onDelete?: (id: string) => void;
};

const Item: VFC<{
  item: SelectableListItem;
  onDelete: SelectableListProps['onDelete'];
}> = ({ item, onDelete }) => {
  const [t] = useTranslation('editor');

  return (
    <>
      <span>{item.name}</span>
      <span className="ml-auto space-x-2">
        {item.deletable && (
          <VscTrash
            className="inline text-[1rem] transition-opacity hover:opacity-50"
            title={t('convert.delete')}
            onClick={() => {
              onDelete?.(item.id);
            }}
          />
        )}
      </span>
    </>
  );
};

export const SelectableList: VFC<SelectableListProps> = ({ id, items, selectedItem, onDelete }) => {
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
                className="inline-flex h-full w-full cursor-pointer items-center rounded-sm px-4 py-1 transition-colors duration-200 hover:bg-black/5 peer-checked:bg-black/5 peer-checked:hover:bg-black/10 dark:hover:bg-white/10 dark:peer-checked:bg-white/10 peer-checked:dark:hover:bg-white/20"
              >
                <Item item={items[key as keyof typeof items]} onDelete={onDelete} />
              </label>
            </div>
          );
        })}
      </div>
    </>
  );
};
