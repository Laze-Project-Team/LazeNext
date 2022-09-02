import fs from 'fs';
import type { NextApiHandler } from 'next';
import path from 'path';

import { COMPETITION_DIR } from '@/const/dir';
import { getLeaderboardList } from '@/features/compete/compete';
import type { Competition, CompetitionJson } from '@/typings/compete';

const handler: NextApiHandler = async (req, res): Promise<void> => {
  const id: string = req.query.id as string;
  const competitionPath = path.join(COMPETITION_DIR, id);
  const jsonPath = path.join(competitionPath, id + '.json');
  if (fs.existsSync(jsonPath)) {
    try {
      const competitionJsonStr = await fs.promises.readFile(jsonPath);
      const competitionJson: CompetitionJson = JSON.parse(
        competitionJsonStr.toString() ?? JSON.stringify({ id: '', name: '' })
      );
      const leaderboardList = await getLeaderboardList(competitionJson.levels, id, competitionJson.name);

      const competition: Competition = {
        ...competitionJson,
        leaderboardList: leaderboardList,
      };
      res.json(competition);
    } catch (e) {
      console.error(e);
      res.status(404).send('');
    }
  } else {
    console.error(`${jsonPath} does not exist.`);
    res.status(404).send('');
  }
};

export default handler;
