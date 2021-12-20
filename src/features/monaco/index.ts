import type { Monaco } from '@monaco-editor/react';

import { Config } from '@/features/monaco/config';
import { Language } from '@/features/monaco/register';
import { lazeTheme, lazeDarkTheme } from '@/features/monaco/theme';

import { completions as completionExport } from '@/typings/editor';

export const store: completionExport = {
  completions: [],
  includes: {},
};

export const initializeMonaco = (monaco: Monaco): void => {
  if (!monaco.languages.getLanguages().some(({ id }) => id === 'laze')) {
    monaco.languages.register(Language);
    monaco.languages.setLanguageConfiguration('laze', Config);
    monaco.editor.defineTheme('laze', lazeTheme);
    monaco.editor.defineTheme('laze-dark', lazeDarkTheme);
  }
};

type ColorMode = 'light' | 'dark';

export const updateColorMode = (monaco: Monaco, colorMode: ColorMode): void => {
  monaco.editor.setTheme(colorMode === 'light' ? 'laze' : 'laze-dark');
};
