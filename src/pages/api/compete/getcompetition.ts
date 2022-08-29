import fs from 'fs';
import type { NextApiHandler } from 'next';
import path from 'path';

import { COMPETITION_DIR } from '@/const/dir';
import type {
  Competition,
  CompetitionByLevel,
  CompetitionJson,
  Competitor,
  CompetitorInfoJson,
} from '@/typings/compete';

const getLeaderboardList = async (
  levels: string[] | undefined,
  competitionPath: string
): Promise<CompetitionByLevel[]> => {
  //Get leaderboard for each level
  const levelsData: (CompetitionByLevel | null)[] = await Promise.all(
    (levels ?? []).map(async (level) => {
      const levelPath = path.join(competitionPath, level);
      // Check if the level exists
      if (fs.existsSync(levelPath)) {
        const competitorNames = await fs.promises.readdir(levelPath);
        const competitors: Competitor[] = await Promise.all(
          competitorNames.map(async (name) => {
            const competitorPath = path.join(levelPath, name);
            const infoBuffer = await fs.promises.readFile(path.join(competitorPath, 'info.json'));
            const infoJson: CompetitorInfoJson = JSON.parse(infoBuffer.toString());
            const competitor: Competitor = {
              id: name,
              ranking: 0,
              rankingData: infoJson.time,
              wasmUrl: path.join(levelPath, name, 'main.wasm'),
              programUrl: path.join(levelPath, name, 'main.laze'),
            };
            return competitor;
          })
        );
        const levelData: CompetitionByLevel = {
          level: level,
          players: competitors,
        };
        return levelData;
      } else {
        return null;
      }
    })
  );
  const finalLevelsData: CompetitionByLevel[] = levelsData.filter((value) => {
    return value != null;
  }) as CompetitionByLevel[];
  return finalLevelsData;
};

export const handler: NextApiHandler = async (req, res): Promise<void> => {
  const id: string = req.query.id as string;
  const competitionPath = path.join(COMPETITION_DIR, id);
  const jsonPath = path.join(competitionPath, id + '.json');
  if (fs.existsSync(jsonPath)) {
    const competitionJsonStr = await fs.promises.readFile(jsonPath);
    const competitionJson: CompetitionJson = JSON.parse(
      competitionJsonStr.toString() ?? JSON.stringify({ id: '', name: '' })
    );
    const leaderboardList = await getLeaderboardList(competitionJson.levels, competitionPath);

    const competition: Competition = {
      ...competitionJson,
      leaderboardList: leaderboardList,
    };
    res.json(competition);
  } else {
    res.status(404);
  }
};
