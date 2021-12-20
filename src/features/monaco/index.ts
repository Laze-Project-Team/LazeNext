import type { Monaco } from '@monaco-editor/react';

import { Config } from '@/features/monaco/config';
import { Language } from '@/features/monaco/register';
import { lazeDarkTheme,lazeTheme } from '@/features/monaco/theme';
import type { completions as completionExport } from '@/typings/editor';

export const store: completionExport = {
  completions: [],
  includes: {},
};

export const initializeMonaco = (monaco: Monaco): void => {
  if (!monaco.languages.getLanguages().some(({ id }) => {return id === 'laze'})) {
    monaco.languages.register(Language);
    monaco.languages.setLanguageConfiguration('laze', Config);
    monaco.editor.defineTheme('laze', lazeTheme);
    monaco.editor.defineTheme('laze-dark', lazeDarkTheme);
  }
};
