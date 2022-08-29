import fs from 'fs';
import type { NextApiHandler } from 'next';

type GetcodeRequest = {
  url: string;
};

const handler: NextApiHandler = async (req, res) => {
  const request = JSON.parse(req.body ?? JSON.stringify({ url: '' })) as GetcodeRequest;
  const path = request.url;
  if (fs.existsSync(path)) {
    const buffer = await fs.promises.readFile(path);
    res.send(buffer.toString());
  } else {
    res.send(path);
  }
};

export default handler;
