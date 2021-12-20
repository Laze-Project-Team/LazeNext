import type { FC } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'next-i18next';
import { VscClose } from 'react-icons/vsc';

import { cx } from '@/features/utils/cx';
import { consoleSlice } from '@/features/redux/console';

type ConsolePanelListItemProps = {
  id: string;
  label: string;
  active: boolean;
  isMaster: boolean;
};

export const ConsolePanelListItem: FC<ConsolePanelListItemProps> = ({ id, children, active, isMaster }) => {
  const [t] = useTranslation('editor');

  const dispatcher = useDispatch();
  const { setActive, removePanel } = consoleSlice.actions;

  const onClick = (itemId: string) => dispatcher(setActive(itemId));

  const onDelete = (itemId: string) => dispatcher(removePanel(itemId));

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
        onClick={() => onClick(id)}
        onKeyPress={() => void 0}
      >
        <span>{children}</span>
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
