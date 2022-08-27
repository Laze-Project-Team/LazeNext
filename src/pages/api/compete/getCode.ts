import type { NextApiHandler } from 'next';

const handler: NextApiHandler = (req, res) => {
  res.send('Success');
};

export default handler;
