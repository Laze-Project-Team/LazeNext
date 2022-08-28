import fs from 'fs';
import type { NextApiHandler } from 'next';

type GetwasmRequest = {
  url: string;
};

const handler: NextApiHandler = async (req, res) => {
  const request = JSON.parse(req.body ?? JSON.stringify({ url: '' })) as GetwasmRequest;
  const path = request.url;
  if (fs.existsSync(path)) {
    const buffer = await fs.promises.readFile(path);
    res.send(buffer);
  } else {
    res.status(404);
  }
};

export default handler;
