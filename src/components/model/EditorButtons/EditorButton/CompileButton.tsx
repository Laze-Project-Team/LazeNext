import { notification } from 'antd';
import type { VFC } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VscLoading, VscRunAll } from 'react-icons/vsc';
import { connect, useDispatch } from 'react-redux';

import { EditorButton } from '@/components/model/EditorButtons/EditorButton/EditorButton';
import { Spin } from '@/components/ui/Spin';
import { compileLaze, runLaze } from '@/features/compiler/initialize';
import { compileFailed } from '@/features/gtm';
import { explorerSlice } from '@/features/redux/explorer';
import type { RootState } from '@/features/redux/root';
import { getCurrentCode, getCurrentFile, store } from '@/features/redux/root';
import { getName } from '@/features/utils/path';
import { competeProgramLangContext } from '@/pages/compete/editor';
import { programLangContext } from '@/pages/editor';

import { editorExecuteParamContext } from '..';
import { competeEditorExecuteParamContext } from '../compete';

type CompileButtonProps = {
  compiled: boolean;
};

const UnconnectedCompileButton: VFC<CompileButtonProps> = ({ compiled }) => {
  const [t] = useTranslation('editor');

  const dispatch = useDispatch();

  const [isCompiling, setIsCompiling] = useState(false);
  const { setCompiled } = explorerSlice.actions;

  const competeLang = useContext(competeProgramLangContext);
  const editorLang = useContext(programLangContext);
  const lang = editorLang || competeLang;
  const competeEditorParam = useContext(competeEditorExecuteParamContext);
  const editorParam = useContext(editorExecuteParamContext);
  const param = editorParam || competeEditorParam;

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

    if (compiled && Object.prototype.hasOwnProperty.call(store.getState().console.console, param?.current.id ?? '')) {
      if (param?.current.interval) {
        clearInterval(param?.current.interval);
      }
      runLaze(param?.current);
    } else {
      if (param?.current.interval) {
        clearInterval(param.current.interval);
      }
      const result = compileLaze(code, getName(file), lang?.current ?? 'en', param?.current);
      setIsCompiling(true);
      result.then((success) => {
        if (success) {
          setIsCompiling(false);
          dispatch(setCompiled(true));
        } else {
          compileFailed();
          setIsCompiling(false);
        }
      });
    }
  };

  useEffect(() => {
    dispatch(setCompiled(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
