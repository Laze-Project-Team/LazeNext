import type Monaco from 'monaco-editor-core';

import { Config } from '@/features/monaco/config';
import { Language } from '@/features/monaco/register';
import { lazeDarkTheme, lazeTheme } from '@/features/monaco/theme';
// import { tokenProvider } from '@/features/monaco/tokenProvider/ja';
import type { completions as completionExport } from '@/typings/editor';

export const store: completionExport = {
  completions: [],
  includes: {},
};

export const initializeMonaco = (monaco: typeof Monaco): void => {
  if (
    !monaco.languages.getLanguages().some(({ id }) => {
      return id === 'laze';
    })
  ) {
    monaco.languages.register(Language);
    monaco.languages.setLanguageConfiguration('laze', Config);
    monaco.editor.defineTheme('laze', lazeTheme);
    monaco.editor.defineTheme('laze-dark', lazeDarkTheme);

    // monaco.languages.setMonarchTokensProvider('laze', tokenProvider);
    // monaco.languages.registerDocumentSemanticTokensProvider('laze', semanticTokenProvider);
    // monaco.languages.registerCompletionItemProvider('laze', completionItemProvider);
  }
};
