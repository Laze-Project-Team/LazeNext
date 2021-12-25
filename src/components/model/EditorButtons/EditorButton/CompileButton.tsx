import { notification } from 'antd';
import type { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { VscRunAll } from 'react-icons/vsc';

import { EditorButton } from '@/components/model/EditorButtons/EditorButton/EditorButton';
import { useCompiler } from '@/features/compiler';
import { getCurrentCode, getCurrentFile } from '@/features/redux/root';
import { getName } from '@/features/utils/path';

export const CompileButton: VFC = () => {
  const [t] = useTranslation('editor');

  useCompiler();

  const onClick = () => {
    const code = getCurrentCode();
    const file = getCurrentFile();
    if (code === null || file === null) {
      notification.open({
        type: 'error',
        duration: 5,
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
