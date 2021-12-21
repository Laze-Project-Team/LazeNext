import type { BeforeMount, OnMount } from '@monaco-editor/react';
import MonacoEditor, { useMonaco } from '@monaco-editor/react';
import { useTranslation } from 'next-i18next';
import type { VFC } from 'react';
import { useContext } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { connect, useDispatch } from 'react-redux';

import { LazeLogo } from '@/components/ui/atoms/LazeLogo';
import { initializeMonaco } from '@/features/monaco';
import { options } from '@/features/monaco/option';
import type { ExplorerState } from '@/features/redux/explorer';
import { explorerSlice } from '@/features/redux/explorer';
import type { RootState } from '@/features/redux/root';
import { colorModeContext } from '@/pages/_app';

type EditorProps = {
  state: ExplorerState;
};

const UnconnectedEditor: VFC<EditorProps> = ({ state }) => {
  const [t] = useTranslation('editor');

  const monaco = useMonaco();

  const { current } = state;
  const [previousCurrent, setPreviousCurrent] = useState<string | null>(null);
  useEffect(() => {
    if (current && previousCurrent !== current) {
      setPreviousCurrent(current);
      const content = state.directory[current]?.content || '';
      const model = monaco?.editor.getModels()[0];
      if (model) {
        model.setValue(content);
      }
    }
  }, [current, monaco?.editor, previousCurrent, state.directory]);

  const dispatcher = useDispatch();
  const { saveFile } = explorerSlice.actions;
  const onChange = (value?: string) => {
    return value && dispatcher(saveFile({ content: value }));
  };

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
      {current ? (
        <MonacoEditor
          language="laze"
          options={options}
          beforeMount={beforeMount}
          onMount={onMount}
          keepCurrentModel
          theme={currentTheme}
          onChange={onChange}
        />
      ) : (
        <div className="h-full flex flex-col space-y-2 justify-center items-center dark:bg-editor dark:text-[#888] text-[#777]">
          <LazeLogo size={100} option="logo_gray" />
          <p>{t('No file is opened')}</p>
          <p>{t('You can open file from the file explorer on the left')}</p>
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
