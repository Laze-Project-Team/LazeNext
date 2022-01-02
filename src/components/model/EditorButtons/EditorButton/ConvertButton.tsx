import { Modal, notification } from 'antd';
import type { VFC } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VscArrowSwap } from 'react-icons/vsc';

import { EditorButton } from '@/components/model/EditorButtons/EditorButton/EditorButton';
import { langList } from '@/const/lang';
import { useCompiler } from '@/features/compiler';
import { getCurrentCode, getCurrentFile } from '@/features/redux/root';

export const ConvertButton: VFC = () => {
  const [t] = useTranslation('editor');
  const [isOpened, setIsOpened] = useState(false);

  useCompiler();

  const defaultLang = typeof window !== 'undefined' ? window?.laze?.props?.variables?.lang ?? 'ja' : 'ja';
  const [newLang, setNewLang] = useState(defaultLang);

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
    window.laze.compiler.convert(file, code, window.laze.props.variables.lang, newLang).then((success) => {
      if (success) {
        window.laze.props.variables.lang = newLang;
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
        <div className="inline-flex items-center opacity-80 px-2">{langList[defaultLang]}</div>
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
                  className="inline-block px-4 py-1 w-full h-full hover:bg-white/10 transition-colors duration-200 rounded-sm peer-checked:bg-white/10 peer-checked:hover:bg-white/15"
                >
                  {langList[key as keyof typeof langList]}
                </label>
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
};
