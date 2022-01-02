import { Modal, notification } from 'antd';
import type { VFC } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VscArrowSwap } from 'react-icons/vsc';

import { EditorButton } from '@/components/model/EditorButtons/EditorButton/EditorButton';
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
  const [newLang, setNewLang] = useState(defaultLang);
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

  const convert = () => {
    const code = getCurrentCode();
    const file = getCurrentFile();
    if (code === null || file === null) {
      FileIsNotOpened();
      return;
    }
    setIsOpened(false);
    setIsConverting(true);
    window.laze.compiler.convert(file, code, window.laze.props.variables.lang, newLang).then((success) => {
      if (success) {
        setIsConverting(false);
        window.laze.props.variables.lang = newLang;
        setLang(newLang);
      }
    });
  };

  const abort = () => {
    setIsOpened(false);
  };

  return (
    <>
      <div className="flex">
        <EditorButton name={t('buttons.convert')} onClick={onClick} Icon={<VscArrowSwap />} />
        <div className="inline-flex items-center opacity-80 px-2">{langList[lang]}</div>
      </div>
      <Modal
        title={t('buttons.convert')}
        visible={isOpened}
        afterClose={abort}
        onOk={convert}
        onCancel={abort}
        cancelText={t('convert.cancel')}
        okText={t('convert.convert')}
      >
        <div className="flex flex-col space-y-1">
          {Object.keys(langList).map((key) => {
            return (
              <div key={key}>
                <input
                  type="radio"
                  id={`convert-lang-${key}`}
                  checked={newLang === key}
                  hidden
                  className="peer"
                  name="convert-lang"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setNewLang(key);
                    }
                  }}
                />
                <label
                  htmlFor={`convert-lang-${key}`}
                  className="inline-block px-4 py-1 w-full h-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200 rounded-sm peer-checked:bg-black/10 dark:peer-checked:bg-white/10 peer-checked:hover:bg-black/[.15] peer-checked:dark:hover:bg-white/20 cursor-pointer"
                >
                  {langList[key as keyof typeof langList]}
                </label>
              </div>
            );
          })}
        </div>
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
