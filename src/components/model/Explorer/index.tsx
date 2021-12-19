import type { VFC } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'next-i18next';
import { VscNewFile, VscNewFolder } from 'react-icons/vsc';

import { explorerSlice } from '@/features/redux/explorer';
import { ExplorerButton } from '@/components/model/Explorer/ExplorerButton';
import DirectoryView from '@/components/model/Explorer/DirectoryView';

export const Explorer: VFC = () => {
  const [t] = useTranslation('editor');

  const dispatcher = useDispatch();
  const { createFile, createFolder } = explorerSlice.actions;

  const newFile = () => dispatcher(createFile({ path: '/' }));
  const newFolder = () => dispatcher(createFolder({ path: '/' }));

  return (
    <>
      <div className="w-full h-full z-10 flex flex-col">
        <div className="flex flex-row items-center h-7 dark:bg-primary-default bg-primary-400">
          <div />
          <div className="ml-auto">
            <ExplorerButton onClick={newFile} title={t('New File')}>
              <VscNewFile />
            </ExplorerButton>
            <ExplorerButton onClick={newFolder} title={t('New Folder')}>
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
