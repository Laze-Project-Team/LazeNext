import type { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { ContextMenuTemplate } from '@/components/model/Explorer/ContextMenu/ContextMenu';
import { explorerSlice } from '@/features/redux/explorer';
import type { ContextMenuItems } from '@/typings/contextmenu';

export const FolderContextMenu: VFC = () => {
  const [t] = useTranslation('editor');
  const dispatcher = useDispatch();
  const { createFile, createFolder, deleteDirent, startRenaming } = explorerSlice.actions;

  const FolderContextMenuItems: ContextMenuItems = [
    {
      name: t('contextmenus.newFile'),
      callback: (path: string) => {
        return dispatcher(createFile({ path: `${path}/` }));
      },
    },
    {
      name: t('contextmenus.newFolder'),
      callback: (path: string) => {
        return dispatcher(createFolder({ path: `${path}/` }));
      },
    },
    {
      name: 'separator',
      separator: true,
    },
    {
      name: t('contextmenus.rename'),
      callback: (path: string) => {
        dispatcher(startRenaming({ path }));
      },
    },
    {
      name: t('contextmenus.delete'),
      callback: (path: string) => {
        return dispatcher(deleteDirent({ path }));
      },
    },
  ];

  return (
    <>
      <ContextMenuTemplate id="explorer-folder" items={FolderContextMenuItems} />
    </>
  );
};
