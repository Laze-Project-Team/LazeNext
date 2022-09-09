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
  publish: boolean;
};

// error handling needed

const handler: NextApiHandler = async (req, res) => {
  const request = JSON.parse(
    req.body ??
      JSON.stringify({
        competition: '',
        level: '',
        name: '',
        time: 100000,
        programUrl: '',
        wasmUrl: '',
        publish: false,
      })
  ) as SubmitRequest;
  const levelPath = path.join(COMPETITION_DIR, request.competition, request.level);
  if (fs.existsSync(levelPath)) {
    const competitorPath = path.join(levelPath, request.name);
    if (!fs.existsSync(competitorPath)) {
      try {
        await fs.promises.mkdir(competitorPath);
      } catch (e) {
        console.error(e);
      }
    }
    const infoJson: CompetitorInfoJson = {
      id: request.name,
      time: Number(request.time.toFixed(2)),
      publish: request.publish,
    };
    try {
      await fs.promises.writeFile(path.join(competitorPath, 'info.json'), JSON.stringify(infoJson));
      await fs.promises.copyFile(request.programUrl, path.join(competitorPath, 'main.laze'));
      await fs.promises.copyFile(request.wasmUrl, path.join(competitorPath, 'main.wasm'));
      res.json({ success: true, publish: request.publish });
    } catch (e) {
      console.error(e);
      res.status(404).json({ success: false, publish: false });
    }
  } else {
    console.error(`${req.url}: ${levelPath} does not exist.`);
    res.status(404).json({ success: false, publish: false });
  }
};

export default handler;
