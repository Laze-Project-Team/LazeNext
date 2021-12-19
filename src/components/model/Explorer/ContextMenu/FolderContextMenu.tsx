import type { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { explorerSlice } from '@/features/redux/explorer';
import { ContextMenuTemplate } from '@/components/model/Explorer/ContextMenu/ContextMenu';
import { ContextMenuItems } from '@/typings/contextmenu';

export const FolderContextMenu: VFC = () => {
  const [t] = useTranslation('editor');
  const dispatcher = useDispatch();
  const { createFile, createFolder, deleteDirent, startRenaming } = explorerSlice.actions;

  const FolderContextMenuItems: ContextMenuItems = [
    {
      name: t('New File'),
      callback: (path: string) => dispatcher(createFile({ path: `${path}/` })),
    },
    {
      name: t('New Folder'),
      callback: (path: string) => dispatcher(createFolder({ path: `${path}/` })),
    },
    {
      name: 'separator',
      separator: true,
    },
    {
      name: t('Rename'),
      callback: (path: string) => {
        dispatcher(startRenaming({ path }));
      },
    },
    {
      name: t('Delete'),
      callback: (path: string) => dispatcher(deleteDirent({ path })),
    },
  ];

  return (
    <>
      <ContextMenuTemplate id="explorer-folder" items={FolderContextMenuItems} />
    </>
  );
};
