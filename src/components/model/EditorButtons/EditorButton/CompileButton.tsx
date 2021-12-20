import type { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { notification } from 'antd';
import { VscRunAll } from 'react-icons/vsc';

import { EditorButton } from '@/components/model/EditorButtons/EditorButton/EditorButton';

import { getName } from '@/features/utils/path';
import { getCurrentCode, getCurrentFile } from '@/features/redux/root';
import { useCompiler } from '@/features/compiler';

export const CompileButton: VFC = () => {
  const [t] = useTranslation('editor');

  if (typeof window !== 'undefined') {
    useCompiler();
  }

  const onClick = () => {
    const code = getCurrentCode();
    const file = getCurrentFile();
    if (code === null || file === null) {
      notification.open({
        type: 'error',
        duration: 5000,
        placement: 'bottomRight',
        message: t('Compile Error'),
        description: t('File is not opened. Please open a file first.'),
      });

      return;
    }

    if (window.laze.props.variables.compiled) {
      window.laze.compiler.run();
    } else {
      window.laze.compiler.compile(code, getName(file));
    }
  };

  return (
    <>
      <EditorButton name={t('Compile & Run')} onClick={onClick} Icon={<VscRunAll />} />
    </>
  );
};
