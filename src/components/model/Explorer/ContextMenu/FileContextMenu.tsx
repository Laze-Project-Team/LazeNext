import type { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { ContextMenuTemplate } from '@/components/model/Explorer/ContextMenu/ContextMenu';
import { explorerSlice } from '@/features/redux/explorer';
import type { ContextMenuItems } from '@/typings/contextmenu';

export const FileContextMenu: VFC = () => {
  const [t] = useTranslation('editor');

  const dispatcher = useDispatch();
  const { deleteDirent, startRenaming } = explorerSlice.actions;

  const menuItems: ContextMenuItems = [
    {
      name: t('Rename'),
      callback: (path: string) => {
        dispatcher(startRenaming({ path }));
      },
    },
    {
      name: t('Delete'),
      callback: (path: string) => {
        dispatcher(deleteDirent({ path }));
      },
    },
  ];

  return (
    <>
      <ContextMenuTemplate id="explorer-file" items={menuItems} />
    </>
  );
};
