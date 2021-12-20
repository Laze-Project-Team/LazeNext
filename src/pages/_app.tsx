import 'nprogress/nprogress.css';
import '@/styles/tailwind.css';
import 'antd/dist/antd.css';
// /editor
import 'react-complex-tree/lib/style.css';
import '@/styles/tree.css';
import 'react-contexify/dist/ReactContexify.min.css';
import '@/styles/contextmenu.css';
import '@/styles/editor-scrollable.css';
import 'monaco-editor/min/vs/editor/editor.main.css';

import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import nprogress from 'nprogress';
import { useEffect } from 'react';
import { Provider } from 'react-redux';

import { store } from '@/features/redux/root';

nprogress.configure({ showSpinner: false, speed: 400, minimum: 0.25 });

const MyApp = ({ Component, pageProps }: AppProps) => {
  if (process.browser) {
    nprogress.start();
  }

  useEffect(() => {
    nprogress.done();
  });

  return (
    <>
      <Provider store={store}>
        <Component {...pageProps} />;
      </Provider>
    </>
  );
};

export default appWithTranslation(MyApp);
