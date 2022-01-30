import { randomBytes } from 'crypto';
import type { DocumentContext } from 'next/document';
import NextDocument, { Head, Html, Main, NextScript } from 'next/document';

import { googleTagManagerId } from '@/components/functional/GoogleTagManager';

type WithNonceProp = {
  nonce: string;
};

class Document extends NextDocument<WithNonceProp> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await NextDocument.getInitialProps(ctx);
    const nonce = randomBytes(128).toString('base64');
    return {
      ...initialProps,
      nonce,
    };
  }
  render() {
    const nonce = this.props.nonce;
    const csp = `object-src 'none'; base-uri 'none'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http: 'nonce-${nonce}' 'strict-dynamic'`;

    return (
      <Html>
        <Head nonce={nonce}>
          {/* 基本設定 */}
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

          {/* ファビコン */}
          <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
          <link rel="manifest" href="/favicons/site.webmanifest" />
          <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />

          {/* SEO */}
          <meta property="og:image" content="/img/logo/logo.png" />

          {/* nonce */}
          <meta httpEquiv="Content-Security-Policy" content={csp} />
        </Head>
        <body>
          <noscript>
            <iframe
              className="invisible hidden"
              src={`https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}`}
              height="0"
              width="0"
            />
          </noscript>
          <Main />
          <NextScript nonce={nonce} />
        </body>
      </Html>
    );
  }
}

export default Document;
