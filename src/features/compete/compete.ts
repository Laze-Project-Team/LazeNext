import fs from 'fs';
import path from 'path';

import { COMPETITION_DIR } from '@/const/dir';
import type { Competition, CompetitionByLevel, CompetitionJson, Competitor } from '@/typings/compete';

export const getAllCompetitions = async (): Promise<string[]> => {
  const competitions = await fs.promises.readdir(COMPETITION_DIR);
  return competitions.filter((value) => {
    return value !== '.gitignore';
  });
};

//Get leaderboard list
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
        const competitors: Competitor[] = competitorNames.map((name) => {
          const competitor: Competitor = {
            id: name,
            ranking: 0,
            rankingData: 3.14,
            programUrl: path.join(levelPath, name, 'main.laze'),
          };
          return competitor;
        });
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

export const getCompetitionData = async (id: string): Promise<Competition | null> => {
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
    return competition;
  } else {
    return null;
  }
};
