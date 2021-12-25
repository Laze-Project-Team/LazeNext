import type { NextApiHandler } from 'next';

import { compileCode } from '@/features/server/compiler';
import type { compileRequest, compileResponse } from '@/typings/compiler';

const handler: NextApiHandler = (req, res) => {
  const { code, option } = req.body as Partial<compileRequest>;

  if (typeof code !== 'string') {
    res.status(400).send('"code" field is not valid');
    return;
  }

  if (typeof option?.lang !== 'string') {
    res.status(400).send('"option" field is not valid');
    return;
  }

  compileCode(code, option)
    .then((result) => {
      const response: compileResponse = {
        success: result.success,
        message: result.message.replace(/^\n+|\n+$/g, ''),
        wasm: result.success ? result.wasm : '',
      };
      res.json(response);
    })
    .catch((err) => {
      res.status(500).send('Internal Server Error');
      console.error(err);
    });
};

export default handler;
