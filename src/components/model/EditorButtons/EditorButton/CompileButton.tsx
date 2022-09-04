import { notification } from 'antd';
import type { VFC } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VscLoading, VscRunAll } from 'react-icons/vsc';
import { connect, useDispatch } from 'react-redux';

import { EditorButton } from '@/components/model/EditorButtons/EditorButton/EditorButton';
import { Spin } from '@/components/ui/Spin';
import { useCompiler } from '@/features/compiler';
import { compileFailed } from '@/features/gtm';
import { explorerSlice } from '@/features/redux/explorer';
import type { RootState } from '@/features/redux/root';
import { getCurrentCode, getCurrentFile, store } from '@/features/redux/root';
import { getName } from '@/features/utils/path';

type CompileButtonProps = {
  compiled: boolean;
};

const UnconnectedCompileButton: VFC<CompileButtonProps> = ({ compiled }) => {
  const [t] = useTranslation('editor');

  useCompiler();

  const dispatch = useDispatch();

  const [isCompiling, setIsCompiling] = useState(false);
  const { setCompiled } = explorerSlice.actions;

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
      compiled &&
      Object.prototype.hasOwnProperty.call(store.getState().console.console, window.laze.props.variables.id)
    ) {
      window.laze.compiler.run();
    } else {
      const result = window.laze.compiler.compile(code, getName(file));
      setIsCompiling(true);
      result.then((success) => {
        if (success) {
          setIsCompiling(false);
          dispatch(setCompiled(true));
        } else {
          compileFailed();
        }
      });
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

export const CompileButton = connect((state: RootState) => {
  return {
    compiled: state.explorer.compiled,
  };
})(UnconnectedCompileButton);
