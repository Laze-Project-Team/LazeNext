import { notification } from 'antd';
import type { VFC } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VscLoading, VscRunAll } from 'react-icons/vsc';

import { EditorButton } from '@/components/model/EditorButtons/EditorButton/EditorButton';
import { Spin } from '@/components/ui/Spin';
import { useCompiler } from '@/features/compiler';
import { getCurrentCode, getCurrentFile, store } from '@/features/redux/root';
import { getName } from '@/features/utils/path';

export const CompileButton: VFC = () => {
  const [t] = useTranslation('editor');

  useCompiler();

  const [isCompiling, setIsCompiiling] = useState(false);

  const onClick = () => {
    const code = getCurrentCode();
    const file = getCurrentFile();
    if (code === null || file === null) {
      notification.open({
        message: t('errors.FileIsNotOpened.title'),
        description: t('errors.FileIsNotOpened.message'),
        type: 'error',
        duration: 5,
        placement: 'bottomRight',
      });

      return;
    }

    if (
      window.laze.props.variables.compiled &&
      Object.prototype.hasOwnProperty.call(store.getState().console.console, window.laze.props.variables.id)
    ) {
      window.laze.compiler.run();
    } else {
      const result = window.laze.compiler.compile(code, getName(file));
      if (result) {
        setIsCompiiling(true);
        result.then(() => {
          setIsCompiiling(false);
        });
      }
    }
  };

  return (
    <>
      <EditorButton
        name={t('buttons.compile')}
        onClick={onClick}
        disabled={isCompiling}
        Icon={
          isCompiling ? (
            <Spin>
              <VscLoading />
            </Spin>
          ) : (
            <VscRunAll />
          )
        }
      />
    </>
  );
};
