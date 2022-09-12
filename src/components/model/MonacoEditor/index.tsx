import type { BeforeMount, OnMount } from '@monaco-editor/react';
import MonacoEditor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useTranslation } from 'next-i18next';
import type { VFC } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { useEffect, useMemo } from 'react';
import { connect, useDispatch } from 'react-redux';

import { formatChar } from '@/components/model/Learn/formatChar';
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
  const [value, setValue] = useState('');
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const updateEditorValue = (value: string) => {
    setValue(value);
    editorRef.current?.getModel()?.setValue(value);
  };

  const { current } = state;
  useEffect(() => {
    if (current) {
      const content = getCurrentCode();
      if (content !== null) {
        updateEditorValue(content);
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
        updateEditorValue(code);
      }
    }
  }, [dispatcher, setValue, state.updated, update]);

  const onMount: OnMount = (editor) => {
    editor.focus();
    editor.addAction({
      id: 'save-file',
      label: 'save',
      // Ctrl+S
      keybindings: [2097],
      contextMenuOrder: 1.5,
      run: () => {
        return void 0;
      },
    });

    editor.onDidCompositionEnd(() => {
      const model = editor.getModel();
      const pos = editor.getPosition();
      if (model && pos) {
        const previousValue = model.getValue();
        const value = formatChar(previousValue);
        if (previousValue !== value) {
          model.setValue(value);
          editor.setPosition(pos);
        }
      }
    });

    editorRef.current = editor;
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
        value={value}
        wrapperProps={{ className: current ? '' : '!hidden' }}
      />
      {current ? (
        <></>
      ) : (
        <div className="flex h-full flex-col items-center justify-center space-y-2 text-[#777] dark:bg-editor dark:text-[#888]">
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
export { UnconnectedEditor };
