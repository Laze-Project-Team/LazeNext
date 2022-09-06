import fs from 'fs';
import path from 'path';

import { COMPETITION_DIR } from '@/const/dir';
import type {
  Competition,
  CompetitionByLevel,
  CompetitionJson,
  Competitor,
  CompetitorInfoJson,
} from '@/typings/compete';

export const getAllCompetitions = async (): Promise<string[]> => {
  const competitions = await fs.promises.readdir(COMPETITION_DIR);
  return competitions.filter((value) => {
    return value !== '.gitignore';
  });
};

//Get leaderboard list
export const getLeaderboardList = async (
  levels: string[] | undefined,
  competitionId: string,
  competitionName: string
): Promise<CompetitionByLevel[]> => {
  const competitionPath = path.join(COMPETITION_DIR, competitionId);
  //Get leaderboard for each level
  const levelsData: (CompetitionByLevel | null)[] = await Promise.all(
    (levels ?? []).map(async (level) => {
      const levelPath = path.join(competitionPath, level);
      // Check if the level exists
      if (fs.existsSync(levelPath)) {
        try {
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
            id: competitionId,
            name: competitionName,
            level: level,
            players: competitors,
          };
          return levelData;
        } catch (e) {
          console.error(e);
          return null;
        }
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
    try {
      const competitionJsonStr = await fs.promises.readFile(jsonPath);
      const competitionJson: CompetitionJson = JSON.parse(
        competitionJsonStr.toString() ?? JSON.stringify({ id: '', name: '' })
      );
      const leaderboardList = await getLeaderboardList(
        competitionJson.levels,
        competitionJson.id,
        competitionJson.name
      );

      const competition: Competition = {
        ...competitionJson,
        leaderboardList: leaderboardList,
      };
      return competition;
    } catch (e) {
      console.error(e);
      return null;
    }
  } else {
    return null;
  }
};
