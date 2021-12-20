import type { FC } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal, notification, Spin } from 'antd';
import { VscFolderOpened } from 'react-icons/vsc';

import { EditorButton } from '@/components/model/EditorButtons/EditorButton/EditorButton';
import { SampleList } from '@/components/model/EditorButtons/SampleList';

import { explorerSlice } from '@/features/redux/explorer';
import { sampleListType } from '@/typings/samplelist';
import { direntType } from '@/typings/directory';
import Portal from '@/components/ui/Portal';

export const SamplesButton: FC = () => {
  const { locale } = useRouter();

  const [t] = useTranslation('editor');

  const [select, setSelect] = useState<string | null>(null);
  const [isSelectOpen, setSelectOpen] = useState(false);
  const [sampleList, setSampleList] = useState<sampleListType>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const dispatcher = useDispatch();
  const { setDirectory } = explorerSlice.actions;

  const onClick = () => {
    setSelectOpen(true);
    setError(null);
    setSampleList({});
    fetch(`/api/editor/samplelist/${locale}`)
      .then((res) => res.json())
      .then((res: sampleListType) => {
        setError(null);
        setSampleList(res);
      })
      .catch(() => {
        setError(t('Somehing went wrong while loading sample list. Please try again later.'));
      });
  };

  const abort = () => void setSelectOpen(false);

  const load = () => {
    if (select) {
      setSelectOpen(false);
      setLoading(true);
      fetch(`/api/editor/sample/${select}`)
        .then((res) => res.json())
        .then((res: Record<string, direntType>) => {
          const directory = Object.keys(res)
            .map((key) => ({
              [key]: {
                ...res[key],
                isRenaming: false,
              },
            }))
            .reduce((acc, curr) => ({ ...acc, ...curr }), {});
          setLoading(false);
          dispatcher(setDirectory(directory));
        })
        .catch(() => {
          setLoading(false);
          notification.open({
            duration: 5000,
            placement: 'bottomRight',
            message: t('Failed to load the sample', { name: sampleList[select].name }),
            description: t('File is not opened. Please open a file first.'),
          });
        });
    }
  };

  return (
    <>
      {isLoading && (
        <Portal>
          <div className="fixed top-0 bottom-4 left-0 right-0 flex justify-center items-center bg-black/40">
            <Spin size="large" />
          </div>
        </Portal>
      )}
      <Modal
        title={t('Loading Sample Selection')}
        visible={isSelectOpen}
        afterClose={abort}
        onOk={load}
        onCancel={abort}
        cancelText={t('Close')}
        okText={t('Load')}
      >
        {(() => {
          if (error) {
            return <p className="text-red-700 dark:text-red-500">{error}</p>;
          }

          if (Object.keys(sampleList).length === 0) {
            return (
              <div className="h-20 flex justify-center items-center">
                <Spin size="large" />
              </div>
            );
          }

          return <SampleList samples={sampleList} setSelect={setSelect} />;
        })()}
      </Modal>

      <EditorButton name={t('Samples')} onClick={onClick} Icon={<VscFolderOpened />} />
    </>
  );
};