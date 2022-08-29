import type { BeforeMount, OnChange, OnMount } from '@monaco-editor/react';
import MonacoEditor from '@monaco-editor/react';
import { Button, message, notification } from 'antd';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useTranslation } from 'next-i18next';
import type { FC, MouseEventHandler } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { VscCopy, VscRunAll } from 'react-icons/vsc';
import { connect, useDispatch } from 'react-redux';

import { formatChar } from '@/components/model/Learn/formatChar';
import { useCompiler } from '@/features/compiler';
import { Config } from '@/features/monaco/config';
import { Language } from '@/features/monaco/register';
import { semanticTokenProvider } from '@/features/monaco/semanticTokenProvider/ja';
import { lazeTheme } from '@/features/monaco/theme';
import type { consoleState } from '@/features/redux/console';
import { consoleSlice } from '@/features/redux/console';
import type { RootState } from '@/features/redux/root';

import { InlineCompletionsProvider, separator } from './InlineCompletionsProvider';
import { Output } from './Output';

declare global {
  interface Window {
    editorPlaceholders: Record<string, string>;
  }
}

const options: monaco.editor.IEditorConstructionOptions & { 'semanticHighlighting.enabled': boolean } = {
  fontFamily: "'Consolas', 'Droid Sans Mono', 'Courier New', ui-monospace, 'Droid Sans Fallback'",
  inlineSuggest: {
    enabled: true,
  },
  wordSeparators: separator,
  minimap: {
    enabled: false,
  },
  unicodeHighlight: {
    ambiguousCharacters: false,
  },
  autoClosingBrackets: 'always',
  'semanticHighlighting.enabled': true,
};

export type EditorProps = {
  placeholder?: string;
  initialValue?: string;
  consoleState: consoleState['console'];
};

export const UnconnectedEditor: FC<EditorProps> = ({ placeholder, initialValue, consoleState }) => {
  const [t] = useTranslation('learn');
  const [value, setValue] = useState(initialValue);
  const [isCompiling, setIsCompiling] = useState(false);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const dispacher = useDispatch();
  const { removePanel } = consoleSlice.actions;

  useCompiler();

  const onChange: OnChange = () => {
    // onChange
  };

  const beforeMount: BeforeMount = (monaco) => {
    if (
      monaco.languages.getLanguages().find((l) => {
        return l.id === 'laze';
      }) === undefined
    ) {
      monaco.languages.register(Language);
      monaco.languages.setLanguageConfiguration('laze', Config);
      monaco.editor.defineTheme('laze', lazeTheme);
      monaco.languages.registerDocumentSemanticTokensProvider('laze', semanticTokenProvider);

      monaco.languages.registerInlineCompletionsProvider('laze', InlineCompletionsProvider);
    }
  };

  const onMount: OnMount = (editor) => {
    editor.updateOptions({
      theme: 'laze',
    });

    editor.onDidChangeCursorSelection(() => {
      editor.getAction('editor.action.inlineSuggest.trigger').run();
    });

    editorRef.current = editor;

    window.editorPlaceholders = window.editorPlaceholders ?? {};
    const id = editor.getModel()?.id;
    if (id !== undefined && placeholder !== undefined) {
      window.editorPlaceholders[id] = placeholder;
    }

    editor.onDidCompositionEnd(() => {
      const model = editor.getModel();
      const pos = editor.getPosition();
      if (model && pos) {
        const value = formatChar(model.getValue());
        model.setValue(value);
        editor.setPosition(pos);
      }
    });
  };

  const onClick: MouseEventHandler<HTMLElement> = () => {
    if (value && editorRef.current) {
      const id = editorRef.current.getModel()?.id;
      if (id !== undefined) {
        Object.keys(consoleState)
          .filter((panelId) => {
            return consoleState[panelId].label === id;
          })
          .forEach((panelId) => {
            dispacher(removePanel(panelId));
          });
        const result = window.laze.compiler.compile(value, id);
        if (result) {
          setIsCompiling(true);
          result.then(() => {
            setIsCompiling(false);
          });
        } else {
          notification.error({
            message: t('compile_error'),
            description: t('compile_error_description'),
          });
        }
      }
    }
  };

  const onCopy: MouseEventHandler<HTMLElement> = () => {
    if (placeholder !== undefined) {
      setValue(placeholder);
      message.success(t('copied'));
    }
  };

  return (
    <>
      <div className="my-4 space-x-4">
        <div>
          <Button onClick={onClick} loading={isCompiling} icon={<VscRunAll className="mr-2 inline" />}>
            {t('run')}
          </Button>
          {placeholder && (
            <Button onClick={onCopy} icon={<VscCopy className="mr-2 inline" />}>
              {t('copy')}
            </Button>
          )}
        </div>
        <div className="h-40 border-[1px]">
          <MonacoEditor
            language="laze"
            theme="laze"
            value={value}
            onChange={onChange}
            onMount={onMount}
            beforeMount={beforeMount}
            options={options}
            keepCurrentModel
          />
        </div>
        <div>
          <Output
            logs={(() => {
              if (editorRef.current !== null) {
                const id = editorRef.current.getModel()?.id;
                if (id !== undefined) {
                  return (
                    Object.values(consoleState).filter((panel) => {
                      return panel.label === id;
                    })[0]?.log ?? []
                  );
                }
              }
              return [];
            })()}
          />
        </div>
      </div>
    </>
  );
};

export const Editor = connect((state: RootState) => {
  return {
    consoleState: state.console.console,
  };
})(UnconnectedEditor);
