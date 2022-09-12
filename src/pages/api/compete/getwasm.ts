import fs from 'fs';
import type { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
  const path: string = decodeURI(req.query.url as string);
  if (fs.existsSync(path)) {
    try {
      const buffer = await fs.promises.readFile(path);
      res.send(buffer);
    } catch (e) {
      console.error(e);
      res.status(404).send('');
    }
  } else {
    console.error(`${req.url}: ${path} does not exist.`);
    res.status(404).send('');
  }
};

export default handler;
