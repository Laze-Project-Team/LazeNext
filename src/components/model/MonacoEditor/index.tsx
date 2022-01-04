import type { BeforeMount, OnMount } from '@monaco-editor/react';
import MonacoEditor, { useMonaco } from '@monaco-editor/react';
import { useTranslation } from 'next-i18next';
import type { VFC } from 'react';
import { useCallback } from 'react';
import { useContext } from 'react';
import { useEffect, useMemo } from 'react';
import { connect, useDispatch } from 'react-redux';

import { Loading } from '@/components/model/MonacoEditor/Loading';
import { LazeLogo } from '@/components/ui/atoms/LazeLogo';
import { initializeMonaco } from '@/features/monaco';
import { options } from '@/features/monaco/option';
import type { ExplorerState } from '@/features/redux/explorer';
import { explorerSlice } from '@/features/redux/explorer';
import type { RootState } from '@/features/redux/root';
import { getCurrentCode } from '@/features/redux/root';
import { colorModeContext } from '@/pages/_app';

type EditorProps = {
  state: ExplorerState;
};

const UnconnectedEditor: VFC<EditorProps> = ({ state }) => {
  const [t] = useTranslation('editor');

  const monaco = useMonaco();

  const setValue = useCallback(
    (content: string) => {
      const model = monaco?.editor.getModels()[0];
      if (model) {
        model.setValue(content);
      }
    },
    [monaco?.editor]
  );

  const { current } = state;
  useEffect(() => {
    if (current) {
      const content = getCurrentCode();
      if (content !== null) {
        setValue(content);
      }
    }
  }, [current, setValue]);

  const dispatcher = useDispatch();
  const { saveFile, update } = explorerSlice.actions;
  const onChange = (value?: string) => {
    const code = getCurrentCode();
    if (value && code !== value) {
      dispatcher(saveFile({ content: value }));
    }
  };

  useEffect(() => {
    if (state.updated) {
      dispatcher(update());
      const code = getCurrentCode();
      if (code) {
        setValue(code);
      }
    }
  }, [dispatcher, setValue, state.updated, update]);

  const onMount: OnMount = (editor) => {
    editor.focus();
  };

  const colorMode = useContext(colorModeContext);

  const beforeMount: BeforeMount = (monaco) => {
    initializeMonaco(monaco);
  };

  const currentTheme = useMemo(() => {
    if (colorMode && colorMode[0] === 'dark') {
      return 'laze-dark';
    }

    return 'laze';
  }, [colorMode]);

  return (
    <>
      <MonacoEditor
        language="laze"
        options={options}
        beforeMount={beforeMount}
        onMount={onMount}
        keepCurrentModel
        theme={currentTheme}
        onChange={onChange}
        loading={<Loading />}
        wrapperProps={{ className: current ? '' : '!hidden' }}
      />
      {current ? (
        <></>
      ) : (
        <div className="h-full flex flex-col space-y-2 justify-center items-center dark:bg-editor dark:text-[#888] text-[#777]">
          <LazeLogo size={100} option="logo_gray" />
          <p>{t('messages.FileIsNotOpened.1')}</p>
          <p>{t('messages.FileIsNotOpened.2')}</p>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    state: state.explorer,
  };
};

export const Editor = connect(mapStateToProps)(UnconnectedEditor);
