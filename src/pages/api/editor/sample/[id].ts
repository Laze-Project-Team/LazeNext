import fs from 'fs';
import type { NextApiHandler } from 'next';

import { SAMPLE_DIR } from '@/const/dir';
import { readDirRecursively } from '@/features/utils/readdir';
import type { direntType } from '@/typings/directory';

const handler: NextApiHandler = (req, res) => {
  const { id, lang } = req.query;

  if (typeof id !== 'string') {
    res.status(400).send('query "id" is not valid');
    return;
  }

  if (typeof lang !== 'string') {
    res.status(400).send('query "lang" is not valid');
    return;
  }

  const sample = `${SAMPLE_DIR}/${id}`;
  if (fs.existsSync(sample)) {
    readDirRecursively(`${sample}/${lang}`).then((contents) => {
      const filtered: Record<string, direntType> = Object.keys(contents).reduce((acc, key) => {
        return {
          ...acc,
          [key]: contents[key],
        };
      }, {});
      res.json(filtered);
    });
  } else {
    res.status(404).send('404 Not found');
  }
};

export default handler;
