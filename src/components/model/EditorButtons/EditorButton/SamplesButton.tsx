import { Modal, notification } from 'antd';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VscFolderOpened, VscLoading } from 'react-icons/vsc';
import { useDispatch } from 'react-redux';

import { EditorButton } from '@/components/model/EditorButtons/EditorButton/EditorButton';
import { SampleList } from '@/components/model/EditorButtons/SampleList';
import { Portal } from '@/components/ui/Portal';
import { Spin } from '@/components/ui/Spin';
import { explorerSlice } from '@/features/redux/explorer';
import type { direntType } from '@/typings/directory';
import type { sampleListType } from '@/typings/samplelist';

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
      .then((res) => {
        return res.json();
      })
      .then((res: sampleListType) => {
        setError(null);
        setSampleList(res);
      })
      .catch(() => {
        setError(t('samples.error'));
      });
  };

  const abort = () => {
    return void setSelectOpen(false);
  };

  const load = () => {
    if (select) {
      setSelectOpen(false);
      setLoading(true);
      fetch(`/api/editor/sample/${select}`)
        .then((res) => {
          return res.json();
        })
        .then((res: Record<string, direntType>) => {
          const directory = Object.keys(res)
            .map((key) => {
              return {
                [key]: {
                  ...res[key],
                  isRenaming: false,
                },
              };
            })
            .reduce((acc, curr) => {
              return { ...acc, ...curr };
            }, {});
          setLoading(false);
          dispatcher(setDirectory(directory));
        })
        .catch(() => {
          setLoading(false);
          notification.open({
            message: t('errors.LoadingSampleFailed.title', { name: sampleList[select].name }),
            description: t('errors.LoadingSampleFailed.message'),
            type: 'error',
            duration: 5,
            placement: 'bottomRight',
          });
        });
    }
  };

  return (
    <>
      {isLoading && (
        <Portal>
          <div className="fixed top-0 bottom-4 left-0 right-0 flex justify-center items-center bg-black/40">
            <Spin className="text-6xl">
              <VscLoading />
            </Spin>
          </div>
        </Portal>
      )}
      <Modal
        title={t('samples.title')}
        visible={isSelectOpen}
        afterClose={abort}
        onOk={load}
        onCancel={abort}
        cancelText={t('samples.cancel')}
        okText={t('samples.load')}
        okButtonProps={{ disabled: Object.keys(sampleList).length === 0 }}
      >
        {(() => {
          if (error) {
            return <p className="text-red-700 dark:text-red-500">{error}</p>;
          }

          if (Object.keys(sampleList).length === 0) {
            return (
              <div className="h-20 flex justify-center items-center">
                <Spin className="text-3xl">
                  <VscLoading />
                </Spin>
              </div>
            );
          }

          return <SampleList samples={sampleList} setSelect={setSelect} />;
        })()}
      </Modal>

      <EditorButton name={t('buttons.samples')} onClick={onClick} Icon={<VscFolderOpened />} />
    </>
  );
};
