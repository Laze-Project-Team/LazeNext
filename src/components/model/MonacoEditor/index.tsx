import { useContext, VFC } from 'react';
import { useRef, useEffect, useState, useMemo } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useTranslation } from 'next-i18next';
import MonacoEditor, { useMonaco, BeforeMount, OnMount } from '@monaco-editor/react';

import { LazeLogo } from '@/components/ui/atoms/LazeLogo';

import { RootState } from '@/features/redux/root';
import { explorerSlice, ExplorerState } from '@/features/redux/explorer';
import { initializeMonaco, updateColorMode } from '@/features/monaco';
import options from '@/features/monaco/option';
import { colorModeContext } from '@/pages/editor';

type EditorProps = {
  state: ExplorerState;
};

const Editor: VFC<EditorProps> = ({ state }) => {
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
  }, [current, previousCurrent, state.directory]);

  const dispatcher = useDispatch();
  const { saveFile } = explorerSlice.actions;
  const onChange = (value?: string) => value && dispatcher(saveFile({ content: value }));

  const onMount: OnMount = (editor) => {
    editor.focus();
  };

  const colorMode = useContext(colorModeContext);

  const beforeMount: BeforeMount = (monaco) => {
    initializeMonaco(monaco);
    updateColorMode(monaco, colorMode ? colorMode[0] : 'light');
  };

  useEffect(() => {
    if (monaco && colorMode) {
      updateColorMode(monaco, colorMode[0]);
    }
  }, [colorMode]);

  return useMemo(
    () => (
      <>
        {current ? (
          <MonacoEditor
            language="laze"
            options={options}
            beforeMount={beforeMount}
            onMount={onMount}
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
    ),
    [current, onMount, beforeMount, onChange]
  );
};

const mapStateToProps = (state: RootState) => ({
  state: state.explorer,
});

export default connect(mapStateToProps)(Editor);
