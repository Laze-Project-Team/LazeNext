import fs from 'fs';
import type { NextApiHandler } from 'next';

import { CACHE_DIR } from '@/const/dir';

const handler: NextApiHandler = (req, res) => {
  const { id } = req.query;
  const wasm = `${CACHE_DIR}/${id}.wasm`;
  if (fs.existsSync(wasm)) {
    fs.promises
      .readFile(wasm)
      .then((file) => {
        res.setHeader('Content-Type', 'application/wasm').send(file);
      })
      .catch((err) => {
        res.status(500).send('Something went wrong while reading file');
        console.error(err);
      });
  } else {
    res.status(404).send('404 Not found');
  }
};

export default handler;
