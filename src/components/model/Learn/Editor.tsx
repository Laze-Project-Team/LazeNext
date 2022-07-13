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

import { InlineCompletionsProvider, separator } from './InlineCompletionsProvider';

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

      monaco.languages.registerInlineCompletionsProvider('laze', InlineCompletionsProvider);
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