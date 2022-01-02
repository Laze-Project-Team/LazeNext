import { notification } from 'antd';
import type { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { VscRunAll } from 'react-icons/vsc';

import { EditorButton } from '@/components/model/EditorButtons/EditorButton/EditorButton';
import { useCompiler } from '@/features/compiler';
import { getCurrentCode, getCurrentFile, store } from '@/features/redux/root';
import { getName } from '@/features/utils/path';

export const CompileButton: VFC = () => {
  const [t] = useTranslation('editor');

  useCompiler();

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
      window.laze.compiler.compile(code, getName(file));
    }
  };

  return (
    <>
      <EditorButton name={t('buttons.compile')} onClick={onClick} Icon={<VscRunAll />} />
    </>
  );
};
