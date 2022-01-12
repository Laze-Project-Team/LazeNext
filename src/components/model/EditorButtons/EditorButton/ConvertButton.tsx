import { Button, Modal, notification } from 'antd';
import type { VFC } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VscArrowSwap, VscRefresh } from 'react-icons/vsc';

import { EditorButton } from '@/components/model/EditorButtons/EditorButton/EditorButton';
import { SelectableList } from '@/components/ui/SelectableList';
import { langList } from '@/const/lang';
import { useCompiler } from '@/features/compiler';
import { getCurrentCode, getCurrentFile } from '@/features/redux/root';
import { cx } from '@/features/utils/cx';
import styles from '@/styles/loading.module.css';

export const ConvertButton: VFC = () => {
  const [t] = useTranslation('editor');
  const [isOpened, setIsOpened] = useState(false);

  useCompiler();

  const defaultLang = typeof window !== 'undefined' ? window?.laze?.props?.variables?.lang ?? 'ja' : 'ja';
  const newLang = useRef(defaultLang);
  const [lang, setLang] = useState(defaultLang);
  const [isConverting, setIsConverting] = useState(false);

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
    window.laze.props.variables.lang = newLang.current;
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
    window.laze.compiler.convert(file, code, window.laze.props.variables.lang, newLang.current).then((success) => {
      if (success) {
        setIsConverting(false);
        window.laze.props.variables.lang = newLang.current;
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lang = localStorage.getItem('compile_lang');
      if (lang) {
        window.laze.props.variables.lang = lang;
        setLang(lang);
      }
    }
  }, []);

  return (
    <>
      <div className="flex">
        <EditorButton name={t('buttons.convert')} onClick={onClick} Icon={<VscArrowSwap />} />
        <div className="inline-flex items-center opacity-80 px-2">{langList[lang]}</div>
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
            <VscRefresh className="inline text-[1.1rem] mr-2" />
            {t('convert.change')}
          </Button>,
          <Button type="primary" key="convert" onClick={convert}>
            <VscArrowSwap className="inline text-[1.1rem] mr-2" />
            {t('convert.convert')}
          </Button>,
        ]}
      >
        <SelectableList id="convert-lang" items={langList} selectedItem={newLang} />
      </Modal>

      <div
        className={cx(
          'fixed top-0 right-0 bottom-0 left-0 bg-black/60 z-10 flex justify-center items-center',
          isConverting ? 'opacity-100 visible' : 'opacity-0 invisible'
        )}
      >
        <div className={styles.loader} />
      </div>
    </>
  );
};
