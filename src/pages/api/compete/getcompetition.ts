import fs from 'fs';
import type { NextApiHandler } from 'next';
import path from 'path';

import { COMPETITION_DIR } from '@/const/dir';
import { getLeaderboardList } from '@/features/compete/compete';
import type { Competition, CompetitionJson } from '@/typings/compete';

const isCompetitionJson = (arg: unknown): arg is CompetitionJson => {
  const p = arg as CompetitionJson;
  return (
    typeof p.explanations === 'object' &&
    typeof p.id === 'string' &&
    typeof p.name === 'object' &&
    (typeof p.imageForLevels === 'object' || typeof p.imageForLevels === 'undefined') &&
    (typeof p.levelIDs === 'object' || typeof p.levelIDs === 'undefined') &&
    (typeof p.levels === 'object' || typeof p.levels === 'undefined')
  );
};

const handler: NextApiHandler = async (req, res): Promise<void> => {
  const id: string = req.query.id as string;
  const lang: string = req.query.lang as string;
  const competitionPath = path.join(COMPETITION_DIR, id);
  const jsonPath = path.join(competitionPath, id + '.json');
  if (fs.existsSync(jsonPath)) {
    try {
      const competitionJsonStr = await fs.promises.readFile(jsonPath);
      const competitionJson: unknown = JSON.parse(
        competitionJsonStr.toString() ?? JSON.stringify({ id: '', name: '' })
      );
      if (!isCompetitionJson(competitionJson)) {
        throw new Error(`The information inside ${jsonPath} is not valid.`);
      }
      const levels = competitionJson.levels ?? {};
      const leaderboardList = await getLeaderboardList(
        competitionJson.id,
        competitionJson.name[lang],
        competitionJson.levelIDs ?? [],
        levels[lang]
      );

      const competition: Competition = {
        levels: levels[lang],
        levelIDs: competitionJson.levelIDs,
        name: competitionJson.name[lang],
        id: competitionJson.id,
        leaderboardList: leaderboardList,
        explanation: competitionJson.explanations[lang] ?? '',
        imageForLevels: competitionJson.imageForLevels,
      };
      res.json(competition);
    } catch (e) {
      console.error(e);
      res.status(404).send('');
    }
  } else {
    console.error(`${req.url}: ${jsonPath} does not exist.`);
    res.status(404).send('');
  }
};

export default handler;
