import fs from 'fs';
import type { NextApiHandler } from 'next';
import path from 'path';

import { COMPETITION_DIR } from '@/const/dir';

const handler: NextApiHandler = async (req, res) => {
  const level: string = req.query.level as string;
  const id: string = req.query.id as string;
  const lang: string = req.query.lang as string;
  const explanationPath = path.join(COMPETITION_DIR, id, 'explanations', level, `${lang}.md`);

  if (fs.existsSync(explanationPath)) {
    try {
      const buffer = await fs.promises.readFile(explanationPath);
      res.send(buffer.toString());
    } catch (e) {
      console.error(e);
      res.status(404).send('');
    }
  } else {
    console.error(`${req.url}: ${explanationPath} does not exist.`);
    res.status(404).send('');
  }
};

export default handler;
