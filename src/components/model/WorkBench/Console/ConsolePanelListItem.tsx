import { useTranslation } from 'next-i18next';
import type { VFC } from 'react';
import { VscClose } from 'react-icons/vsc';
import { useDispatch } from 'react-redux';

import { consoleSlice } from '@/features/redux/console';
import { cx } from '@/features/utils/cx';

type ConsolePanelListItemProps = {
  id: string;
  label: string;
  active: boolean;
  isMaster: boolean;
};

export const ConsolePanelListItem: VFC<ConsolePanelListItemProps> = ({ id, label, active, isMaster }) => {
  const [t] = useTranslation('editor');

  const dispatcher = useDispatch();
  const { setActive, removePanel } = consoleSlice.actions;

  const onClick = (itemId: string) => {
    return dispatcher(setActive(itemId));
  };

  const onDelete = (itemId: string) => {
    return dispatcher(removePanel(itemId));
  };

  return (
    <>
      <div
        key={id}
        role="button"
        tabIndex={0}
        className={cx(
          'flex items-center',
          'px-1 py-[0.1rem]',
          'bg-gray-800 dark:bg-white',
          '!bg-opacity-0',
          active ? '!bg-opacity-10' : '!hover:bg-opacity-5'
        )}
        onClick={() => {
          return onClick(id);
        }}
        onKeyPress={() => {
          return void 0;
        }}
      >
        <span>{label}</span>
        {isMaster || (
          <button
            type="button"
            className="ml-auto hover:bg-white/5"
            title={t('Close')}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
          >
            <VscClose />
          </button>
        )}
      </div>
    </>
  );
};
