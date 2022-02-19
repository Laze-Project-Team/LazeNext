import { useTranslation } from 'next-i18next';
import type { VFC } from 'react';
import { VscNewFile, VscNewFolder } from 'react-icons/vsc';
import { useDispatch } from 'react-redux';

import { DirectoryView } from '@/components/model/Explorer/DirectoryView';
import { ExplorerButton } from '@/components/model/Explorer/ExplorerButton';
import { explorerSlice } from '@/features/redux/explorer';

export const Explorer: VFC = () => {
  const [t] = useTranslation('editor');

  const dispatcher = useDispatch();
  const { createFile, createFolder } = explorerSlice.actions;

  const newFile = () => {
    return dispatcher(createFile({ path: '/' }));
  };
  const newFolder = () => {
    return dispatcher(createFolder({ path: '/' }));
  };

  return (
    <>
      <div className="z-10 flex h-full w-full flex-col">
        <div className="flex h-7 flex-row items-center bg-primary-400 dark:bg-primary-default">
          <div />
          <div className="ml-auto">
            <ExplorerButton onClick={newFile} title={t('buttons.newFile')}>
              <VscNewFile />
            </ExplorerButton>
            <ExplorerButton onClick={newFolder} title={t('buttons.newFile')}>
              <VscNewFolder />
            </ExplorerButton>
          </div>
        </div>
        <div className="flex-1">
          <DirectoryView />
        </div>
      </div>
    </>
  );
};
