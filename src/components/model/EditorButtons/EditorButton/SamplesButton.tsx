import { Modal, notification } from 'antd';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VscFolderOpened, VscLoading } from 'react-icons/vsc';
import { useDispatch } from 'react-redux';

import { EditorButton } from '@/components/model/EditorButtons/EditorButton/EditorButton';
import { Portal } from '@/components/ui/Portal';
import { SelectableList } from '@/components/ui/SelectableList';
import { Spin } from '@/components/ui/Spin';
import { sampleLoad } from '@/features/gtm';
import { explorerSlice } from '@/features/redux/explorer';
import { store } from '@/features/redux/root';
import type { direntType } from '@/typings/directory';
import type { sampleListType } from '@/typings/samplelist';

export const SamplesButton: FC = () => {
  const { locale } = useRouter();

  const [t] = useTranslation('editor');

  const select = useRef<string | null>(null);
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

  const load = useCallback(() => {
    if (select.current) {
      sampleLoad(select.current);
      setSelectOpen(false);
      setLoading(true);
      fetch(`/api/editor/sample/${select.current}`)
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
          dispatcher(setDirectory({ directory, projectName: sampleList[select.current ?? '']?.name ?? '' }));
        })
        .catch((e) => {
          console.error(e);

          setLoading(false);
          notification.open({
            message: t('errors.LoadingSampleFailed.title', {
              name: sampleList[select.current ?? '']?.name ?? '?????',
            }),
            description: t('errors.LoadingSampleFailed.message'),
            type: 'error',
            duration: 5,
            placement: 'bottomRight',
          });
        });
    }
  }, [dispatcher, sampleList, setDirectory, t]);

  useEffect(() => {
    if (store.getState().explorer.projectName === null) {
      // 最初に表示されるサンプル
      select.current = 'welcome';
      load();
    }
  }, [load]);

  return (
    <>
      {isLoading && (
        <Portal>
          <div className="fixed top-0 bottom-4 left-0 right-0 flex items-center justify-center bg-black/40">
            <Spin className="text-6xl">
              <VscLoading className="text-gray-100" />
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
              <div className="flex h-20 items-center justify-center">
                <Spin className="text-3xl">
                  <VscLoading />
                </Spin>
              </div>
            );
          }

          const sampleListItems = Object.keys(sampleList)
            .map((key) => {
              return { [key]: sampleList[key].name };
            })
            .reduce((acc, curr) => {
              return { ...acc, ...curr };
            }, {});

          return <SelectableList id="samplelist" items={sampleListItems} selectedItem={select} />;
        })()}
      </Modal>

      <EditorButton name={t('buttons.samples')} onClick={onClick} Icon={<VscFolderOpened />} />
    </>
  );
};
