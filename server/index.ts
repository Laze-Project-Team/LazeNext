/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const appInsights = require('applicationinsights');

import compression from 'compression';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import next from 'next';

import { clean } from './clean';

dotenv.config();

appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING).start();

const CERT_DIR = process.env.CERT_DIR ?? './certs';
const PORT = parseInt(process.env.PORT ?? '', 10) || 3000;
const KEY_PATH = `${CERT_DIR}/privkey.pem`;
const CERT_PATH = `${CERT_DIR}/fullchain.pem`;
const useSSL = process.env.SSL === 'true';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

type uncheckedCredentials = {
  key: string | false;
  cert: string | false;
};

type checkedCredentials = {
  key: string;
  cert: string;
};

const credentials: uncheckedCredentials = {
  key: fs.existsSync(KEY_PATH) && fs.readFileSync(KEY_PATH, { encoding: 'utf-8' }),
  cert: fs.existsSync(CERT_PATH) && fs.readFileSync(CERT_PATH, { encoding: 'utf-8' }),
};

app.prepare().then(() => {
  if (dev) {
    const server = express();
    server.use(compression({ level: 9, memLevel: 9 }));

    server.all('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(PORT, () => {
      console.log(`> Ready on http://localhost:${PORT}`);
    });
  } else {
    if (useSSL) {
      if (!checkCert(credentials)) {
        throw new Error('Missing SSL certificate');
      }

      if (PORT !== 443) {
        throw new Error('SSL port must be 443');
      }

      // http
      {
        const server = express();

        server.all('*', (req, res) => {
          // 全てhttpsにリダイレクト
          res.redirect(`https://${req.hostname}${req.url}`);
        });

        http.createServer(server).listen(80);
      }
      // https
      {
        const server = express();
        server.use(compression({ level: 9, memLevel: 9 }));

        server.all('*', (req, res) => {
          return handle(req, res);
        });

        https.createServer(credentials, server).listen(PORT, () => {
          console.log(`> Ready on https://localhost:${PORT} (SSL)`);
        });
      }
    } else {
      const server = express();
      server.use(compression({ level: 9, memLevel: 9 }));

      server.all('*', (req, res) => {
        return handle(req, res);
      });

      server.listen(PORT, () => {
        console.log(`> Ready on http://localhost:${PORT}`);
      });
    }
    // キャッシュ削除
    {
      clean();
      const CHECK_INTERVAL = 1000 * 60 * 60; // 1時間
      setInterval(clean, CHECK_INTERVAL);
    }
  }
});

const checkCert = (credentials: uncheckedCredentials): credentials is checkedCredentials => {
  if (!credentials.key || !credentials.cert) {
    return false;
  }

  return true;
};
