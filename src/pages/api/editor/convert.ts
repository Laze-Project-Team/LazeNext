import type { NextApiHandler } from 'next';

import { convertCode } from '@/features/server/converter';
import type { convertRequest } from '@/typings/compiler';

const handler: NextApiHandler = (req, res) => {
  const { code, option } = req.body as Partial<convertRequest>;

  if (typeof code !== 'string') {
    res.status(400).send('"code" field is not valid');
    return;
  }

  if (typeof option?.from !== 'string' || typeof option?.to !== 'string') {
    res.status(400).send('"option" field is not valid');
    return;
  }

  convertCode(code, option).then((result) => {
    if (!result.success) {
      console.error(result);
    }
    return res.json(result);
  });
};

export default handler;
