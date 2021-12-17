import 'nprogress/nprogress.css';
import 'antd/dist/antd.css';
import 'src/styles/tailwind.css';

import type { AppProps } from 'next/app';
import nprogress from 'nprogress';
import { useEffect } from 'react';
import { appWithTranslation } from 'next-i18next';

nprogress.configure({ showSpinner: false, speed: 400, minimum: 0.25 });

const MyApp = ({ Component, pageProps }: AppProps) => {
  if (process.browser) {
    nprogress.start();
  }

  useEffect(() => {
    nprogress.done();
  });

  return <Component {...pageProps} />;
};

export default appWithTranslation(MyApp);
