import type { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { ContextMenuTemplate } from '@/components/model/Explorer/ContextMenu/ContextMenu';
import { explorerSlice } from '@/features/redux/explorer';

export const RootContextMenu: VFC = () => {
  const [t] = useTranslation('editor');
  const dispatcher = useDispatch();
  const { createFile, createFolder } = explorerSlice.actions;

  const RootContextMenuItems = [
    {
      name: t('New File'),
      callback: (path: string) => {return dispatcher(createFile({ path }))},
    },
    {
      name: t('New Folder'),
      callback: (path: string) => {return dispatcher(createFolder({ path }))},
    },
  ];

  return (
    <>
      <ContextMenuTemplate id="explorer-root" items={RootContextMenuItems} />
    </>
  );
};
