import 'monaco-editor-core/min/vs/editor/editor.main.css';

import type Monaco from 'monaco-editor-core';
import { useTranslation } from 'next-i18next';
import type { VFC } from 'react';
import { useCallback } from 'react';
import { useRef, useState } from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';

import { Loading } from '@/components/model/MonacoEditor/Loading';
import { LazeLogo } from '@/components/ui/atoms/LazeLogo';
import { initializeLSP } from '@/features/monaco';
import { initializeMonaco } from '@/features/monaco/index';
import { options } from '@/features/monaco/option';
import type { ExplorerState } from '@/features/redux/explorer';
import { explorerSlice } from '@/features/redux/explorer';
import type { RootState } from '@/features/redux/root';
import { getCurrentCode } from '@/features/redux/root';
import { cx } from '@/features/utils/cx';
import { colorModeContext } from '@/pages/_app';

type EditorProps = {
  state: ExplorerState;
};

const UnconnectedEditor: VFC<EditorProps> = ({ state }) => {
  const [t] = useTranslation('editor');
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const [monaco, setMonaco] = useState<typeof Monaco | null>(null);
  const [mounted, setMounted] = useState(false);

  const { current } = state;

  const dispatcher = useDispatch();
  const { saveFile, update } = explorerSlice.actions;

  const onChange = useCallback(
    (value?: string) => {
      const code = getCurrentCode();
      if (value && code !== value) {
        dispatcher(saveFile({ content: value }));
      }
    },
    [dispatcher, saveFile]
  );

  useEffect(() => {
    (async () => {
      if (!editor) {
        const monaco = await import('monaco-editor-core');
        const MODEL_URI = 'inmemory://model.json';
        const MONACO_URI = monaco.Uri.parse(MODEL_URI);

        const model = monaco.editor.createModel(getCurrentCode() ?? '', 'json', MONACO_URI);
        initializeMonaco(monaco);
        if (editorRef.current) {
          const editor = monaco.editor.create(editorRef.current, {
            ...options,
            model: model,
            lightbulb: {
              enabled: true,
            },
          });
          setEditor(editor);
          setMonaco(monaco);

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
          editor.onDidChangeModelContent(() => {
            onChange(editor.getValue());
          });
          setMounted(true);
        }

        initializeLSP(monaco);
      }
    })();
  }, [editor, onChange]);

  useEffect(() => {
    if (current) {
      const content = getCurrentCode();
      if (content !== null) {
        editor?.setValue(content);
      }
    }
  }, [current, editor, editor?.setValue]);

  useEffect(() => {
    if (state.updated) {
      dispatcher(update());
      const code = getCurrentCode();
      if (code) {
        editor?.setValue(code);
      }
    }
  }, [dispatcher, editor, editor?.setValue, state.updated, update]);

  const colorMode = useContext(colorModeContext);

  useEffect(() => {
    if (colorMode) {
      monaco?.editor.setTheme(colorMode[0] === 'light' ? 'laze' : 'laze-dark');
    }
  }, [colorMode, monaco?.editor]);

  return (
    <>
      <div ref={editorRef} className={cx('h-full', !current && 'hidden')} />
      {mounted ? (
        current ? (
          <></>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-2 text-[#777] dark:bg-editor dark:text-[#888]">
            <LazeLogo size={100} option="logo_gray" />
            <p>{t('messages.FileIsNotOpened.1')}</p>
            <p>{t('messages.FileIsNotOpened.2')}</p>
          </div>
        )
      ) : (
        <Loading />
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
