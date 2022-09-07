import 'nprogress/nprogress.css';
import '@/styles/tailwind.css';
import 'antd/dist/antd.variable.min.css';
import '@/styles/antd.css';
// /editor
import 'react-complex-tree/lib/style.css';
import '@/styles/tree.css';
import 'react-contexify/dist/ReactContexify.min.css';
import '@/styles/contextmenu.css';
import 'monaco-editor/min/vs/editor/editor.main.css';
import '@/styles/indexlist.css';
import '@/styles/resizer.css';
import '@/styles/flexfix.css';
import '@/styles/editor-scrollable.css';

import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import nprogress from 'nprogress';
import type { Dispatch, SetStateAction } from 'react';
import { createContext, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';

import type { GoogleTagManagerId } from '@/components/functional/GoogleTagManager';
import { GoogleTagManager, googleTagManagerId } from '@/components/functional/GoogleTagManager';
import { ColorMode } from '@/components/layout/ColorMode';
import { AuthProvider } from '@/components/model/Context/AuthContext';
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

  const queryClient = new QueryClient();

  return (
    <>
      {googleTagManagerId && <GoogleTagManager googleTagManagerId={googleTagManagerId as GoogleTagManagerId} />}
      <QueryClientProvider client={queryClient}>
        <colorModeContext.Provider value={[colorMode, setColorMode]}>
          <ColorMode colorMode={colorMode}>
            <Provider store={store}>
              <AuthProvider>
                <Component {...pageProps} />
              </AuthProvider>
            </Provider>
          </ColorMode>
        </colorModeContext.Provider>
      </QueryClientProvider>
    </>
  );
};

export default appWithTranslation(MyApp);
