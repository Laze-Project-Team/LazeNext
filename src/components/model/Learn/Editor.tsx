import type { BeforeMount, OnChange, OnMount } from '@monaco-editor/react';
import MonacoEditor, { useMonaco } from '@monaco-editor/react';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import type { FC } from 'react';
import { useRef } from 'react';
import { useState } from 'react';

import { Config } from '@/features/monaco/config';
import { Language } from '@/features/monaco/register';
import { semanticTokenProvider } from '@/features/monaco/semanticTokenProvider/ja';
import { lazeTheme } from '@/features/monaco/theme';

declare global {
  interface Window {
    editorPlaceholders: Record<string, string>;
  }
}

// eslint-disable-next-line no-irregular-whitespace
const separator = `()（）[]［］{}｛｝'’"”「」&＆|｜=＝-ー+＋*＊/%％,.:：;； 　`;

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
  'semanticHighlighting.enabled': true,
};

export type EditorProps = {
  placeholder?: string;
  initialValue?: string;
  cursor?: {
    lineNumber: number;
    column: number;
  };
};

export const Editor: FC<EditorProps> = ({ placeholder, initialValue, cursor }) => {
  const [value, setValue] = useState(initialValue);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monaco = useMonaco();

  const onChange: OnChange = (val) => {
    if (val) {
      setValue(val);
    }
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

      monaco.languages.registerInlineCompletionsProvider('laze', {
        provideInlineCompletions: (model, position) => {
          const val = model.getValue();
          const placeholder = window.editorPlaceholders[model.id];

          const suggestText = placeholder
            .split('\n')
            .map((line, i) => {
              if (i === position.lineNumber - 1) {
                let currentWord = '';
                if (position.column > 1) {
                  for (let j = position.column - 2; j >= 0; j--) {
                    const char = line[j];
                    if (char === undefined || separator.includes(char)) {
                      break;
                    }
                    currentWord = char + currentWord;
                  }
                }
                return currentWord + line.substring(position.column - 1);
              } else {
                const currentLine = val.split('\n')[position.lineNumber - 1];
                if (line.startsWith(currentLine)) {
                  return line.substring(currentLine.length);
                } else {
                  return '';
                }
              }
            })
            .filter((line, i) => {
              return i >= position.lineNumber - 1 && line;
            })
            .join('\n');

          return {
            items: [{ text: suggestText }],
          };
        },
        freeInlineCompletions: () => {
          return void 0;
        },
      });
    }
  };

  const onMount: OnMount = (editor) => {
    editor.updateOptions({
      theme: 'laze',
    });
    if (monaco) {
      if (cursor) {
        editor.setPosition(new monaco.Position(cursor.lineNumber, cursor.column));
      }
    }

    editor.onDidChangeCursorSelection(() => {
      editor.getAction('editor.action.inlineSuggest.trigger').run();
    });

    editorRef.current = editor;

    window.editorPlaceholders = window.editorPlaceholders ?? {};
    const id = editor.getModel()?.id;
    if (id !== undefined && placeholder !== undefined) {
      window.editorPlaceholders[id] = placeholder;
    }
  };

  return (
    <>
      <div className="h-40 border-2">
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
    </>
  );
};
