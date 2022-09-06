import { Button, Modal, notification } from 'antd';
import { useRouter } from 'next/router';
import type { VFC } from 'react';
import { useContext } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VscArrowSwap, VscRefresh } from 'react-icons/vsc';

import { EditorButton } from '@/components/model/EditorButtons/EditorButton/EditorButton';
import { UploadNewLanguage } from '@/components/model/EditorButtons/EditorButton/UploadNewLanguage';
import type { SelectableListItem } from '@/components/ui/SelectableList';
import { SelectableList } from '@/components/ui/SelectableList';
import { langList as rawLangList } from '@/const/lang';
import { useCompiler } from '@/features/compiler';
import { getCurrentCode, getCurrentFile } from '@/features/redux/root';
import { cx } from '@/features/utils/cx';
import { getName } from '@/features/utils/path';
import { programLangContext } from '@/pages/compete/editor';
import styles from '@/styles/loading.module.css';

export const ConvertButton: VFC = () => {
  const { locale } = useRouter();
  const [t] = useTranslation('editor');
  const [isOpened, setIsOpened] = useState(false);

  useCompiler();

  const defaultLang =
    typeof window !== 'undefined' ? window?.laze?.props?.variables?.lang ?? locale ?? 'en' : locale ?? 'en';
  const newLang = useRef(defaultLang);
  const [lang, setLang] = useState(defaultLang);
  const [isConverting, setIsConverting] = useState(false);

  const langContext = useContext(programLangContext);

  const concatItem = (acc: Record<string, SelectableListItem>, cur: SelectableListItem) => {
    acc[cur.id] = cur;
    return acc;
  };
  const [langList, setLangList] = useState(
    Object.keys(rawLangList)
      .map((key) => {
        return {
          id: key,
          name: rawLangList[key],
          deletable: false,
        };
      })
      .reduce(concatItem, {})
  );

  const onDelete = (id: string) => {
    setLangList(
      Object.values(langList)
        .filter((item) => {
          return item.id !== id;
        })
        .reduce(concatItem, {})
    );

    const storage = localStorage.getItem('custom_lang');
    if (storage) {
      const langs: Record<string, { name: string; content: string }> = JSON.parse(storage);
      delete langs[id];
      localStorage.setItem('custom_lang', JSON.stringify(langs));
    }
  };

  const FileIsNotOpened = () => {
    notification.open({
      message: t('errors.FileIsNotOpened.title'),
      description: t('errors.FileIsNotOpened.message'),
      type: 'error',
      duration: 5,
      placement: 'bottomRight',
    });
  };

  const onClick = () => {
    const code = getCurrentCode();
    const file = getCurrentFile();
    if (code === null || file === null) {
      FileIsNotOpened();
      return;
    }

    setIsOpened(true);
  };

  const change = () => {
    setLang(newLang.current);
    if (langContext?.current) {
      langContext.current = newLang.current;
    }
    localStorage.setItem('compile_lang', newLang.current);
    setIsOpened(false);
  };

  const convert = () => {
    const code = getCurrentCode();
    const file = getCurrentFile();
    if (code === null || file === null) {
      FileIsNotOpened();
      return;
    }
    setIsOpened(false);
    setIsConverting(true);
    window.laze.compiler
      .convert(file, code, langContext?.current ?? 'en', newLang.current, getName(file))
      .then((success) => {
        if (success) {
          setIsConverting(false);
          if (langContext?.current) {
            langContext.current = newLang.current;
          }
          setLang(newLang.current);
          localStorage.setItem('compile_lang', newLang.current);
        } else {
          setIsConverting(false);
        }
      });
  };

  const abort = () => {
    setIsOpened(false);
  };

  const addCustomLanguage = useCallback((id: string, name: string) => {
    setLangList((langList) => {
      return {
        ...langList,
        [id]: {
          id,
          name,
          deletable: true,
        },
      };
    });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lang = localStorage.getItem('compile_lang');
      if (lang) {
        if (langContext?.current) {
          langContext.current = lang;
        }
        setLang(lang);
      }
    }
  }, []);

  return (
    <>
      <div className="flex">
        <EditorButton name={t('buttons.convert')} onClick={onClick} Icon={<VscArrowSwap />} />
        <div className="inline-flex items-center px-2 opacity-80">{langList[lang]?.name ?? ''}</div>
      </div>
      <Modal
        title={t('buttons.convert')}
        visible={isOpened}
        onCancel={abort}
        footer={[
          <Button type="default" key="cancel" onClick={abort}>
            {t('convert.cancel')}
          </Button>,
          <Button type="primary" key="change" onClick={change}>
            <VscRefresh className="mr-2 inline text-[1.1rem]" />
            {t('convert.change')}
          </Button>,
          <Button type="primary" key="convert" onClick={convert}>
            <VscArrowSwap className="mr-2 inline text-[1.1rem]" />
            {t('convert.convert')}
          </Button>,
        ]}
      >
        <SelectableList id="convert-lang" items={langList} selectedItem={newLang} onDelete={onDelete} />
        <div className="mt-4 flex justify-center">
          <UploadNewLanguage addCustomLanguage={addCustomLanguage} />
        </div>
      </Modal>

      <div
        className={cx(
          'fixed top-0 right-0 bottom-0 left-0 z-10 flex items-center justify-center bg-black/60',
          isConverting ? 'visible opacity-100' : 'invisible opacity-0'
        )}
      >
        <div className={styles.loader} />
      </div>
    </>
  );
};
