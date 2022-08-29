import fs from 'fs';
import type { NextApiHandler } from 'next';
import path from 'path';

import { COMPETITION_DIR } from '@/const/dir';
import type { CompetitorInfoJson } from '@/typings/compete';

export type SubmitRequest = {
  competition: string;
  level: string;
  name: string;
  programUrl: string;
  wasmUrl: string;
  time: number;
};

// error handling needed

const handler: NextApiHandler = async (req, res) => {
  const request = JSON.parse(
    req.body ?? JSON.stringify({ competition: '', level: '', name: '', time: 100000, programUrl: '', wasmUrl: '' })
  ) as SubmitRequest;
  const levelPath = path.join(COMPETITION_DIR, request.competition, request.level);
  if (fs.existsSync(levelPath)) {
    const competitorPath = path.join(levelPath, request.name);
    await fs.promises.mkdir(competitorPath);
    await fs.promises.copyFile(request.programUrl, path.join(competitorPath, 'main.laze'));
    await fs.promises.copyFile(request.wasmUrl, path.join(competitorPath, 'main.wasm'));
    const infoJson: CompetitorInfoJson = {
      id: request.name,
      time: Number(request.time.toFixed(2)),
    };
    await fs.promises.writeFile(path.join(competitorPath, 'info.json'), JSON.stringify(infoJson));
    res.json({ success: true });
  } else {
    res.status(404);
  }
};

export default handler;
