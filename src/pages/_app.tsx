import 'nprogress/nprogress.css';
import '@/styles/tailwind.css';
import 'antd/dist/antd.variable.min.css';
import '@/styles/antd.css';
// /editor
import 'react-complex-tree/lib/style.css';
import '@/styles/tree.css';
import 'react-contexify/dist/ReactContexify.min.css';
import '@/styles/contextmenu.css';
import '@/styles/editor-scrollable.css';
import 'monaco-editor/min/vs/editor/editor.main.css';
import '@/styles/indexlist.css';
import '@/styles/resizer.css';
import '@/styles/flexfix.css';

import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import nprogress from 'nprogress';
import type { Dispatch, SetStateAction } from 'react';
import { createContext, useEffect, useState } from 'react';
import { Provider } from 'react-redux';

import { ColorMode } from '@/components/layout/ColorMode';
import { store } from '@/features/redux/root';

nprogress.configure({ showSpinner: false, speed: 400, minimum: 0.25 });

export type colorModeType = 'dark' | 'light';
export const colorModeContext = createContext<[colorModeType, Dispatch<SetStateAction<colorModeType>>] | null>(null);

const validateColorMode = (colorMode: string): colorModeType => {
  if (colorMode === 'dark') {
    return 'dark';
  }
  return 'light';
};

const MyApp = ({ Component, pageProps }: AppProps) => {
  if (process.browser) {
    nprogress.start();
  }

  useEffect(() => {
    nprogress.done();
  });

  const initialColorMode = typeof window !== 'undefined' ? localStorage.getItem('colorMode') ?? 'light' : 'light';
  const [colorMode, setColorMode] = useState<colorModeType>(validateColorMode(initialColorMode));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', colorMode === 'dark');
    if (typeof window !== 'undefined') {
      localStorage.setItem('colorMode', colorMode);
    }
  }, [colorMode]);

  return (
    <>
      <colorModeContext.Provider value={[colorMode, setColorMode]}>
        <ColorMode colorMode={colorMode}>
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
        </ColorMode>
      </colorModeContext.Provider>
    </>
  );
};

export default appWithTranslation(MyApp);
