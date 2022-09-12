import fs from 'fs';
import path from 'path';

import { COMPETITION_DIR } from '@/const/dir';
import { filterNull } from '@/features/utils/filterNull';
import type {
  Competition,
  CompetitionByLevel,
  CompetitionJson,
  Competitor,
  CompetitorInfoJson,
} from '@/typings/compete';

export const getAllCompetitions = async (): Promise<string[]> => {
  const competitions = await fs.promises.readdir(COMPETITION_DIR, { withFileTypes: true });
  return competitions
    .filter((dirent) => {
      return dirent.name !== '.gitignore' && dirent.isDirectory();
    })
    .map((dirent) => {
      return dirent.name;
    });
};

const isCompetitorInfoJson = (args: unknown): args is CompetitorInfoJson => {
  const p = args as CompetitorInfoJson;
  return typeof p.id === 'string' && typeof p.publish === 'boolean' && typeof p.time === 'number';
};

//Get leaderboard list
export const getLeaderboardList = async (
  competitionId: string,
  competitionName: string,
  levelIDs: string[] | undefined,
  levels: string[] | undefined
): Promise<CompetitionByLevel[]> => {
  const competitionPath = path.join(COMPETITION_DIR, competitionId);
  //Get leaderboard for each level
  const levelsData: (CompetitionByLevel | null)[] = await Promise.all(
    (levelIDs ?? []).map(async (level, index) => {
      const levelPath = path.join(competitionPath, level);
      // Check if the level exists
      if (fs.existsSync(levelPath)) {
        try {
          const competitorNames = await fs.promises.readdir(levelPath, { withFileTypes: true });
          const competitors: Competitor[] = filterNull(
            await Promise.all(
              competitorNames.map(async (dirent) => {
                if (!dirent.isDirectory()) return;
                const name = dirent.name;
                const competitorPath = path.join(levelPath, name);
                const infoBuffer = await fs.promises.readFile(path.join(competitorPath, 'info.json'));
                const infoJson: unknown = JSON.parse(infoBuffer.toString());
                if (isCompetitorInfoJson(infoJson)) {
                  const competitor: Competitor = {
                    id: name,
                    ranking: 0,
                    rankingData: infoJson.time,
                    wasmUrl: path.join(levelPath, name, 'main.wasm'),
                    programUrl: path.join(levelPath, name, 'main.laze'),
                    publish: infoJson.publish,
                  };
                  return competitor;
                } else {
                  const competitor: Competitor = {
                    id: name,
                    ranking: 0,
                    rankingData: 0,
                    wasmUrl: path.join(levelPath, name, 'main.wasm'),
                    programUrl: path.join(levelPath, name, 'main.laze'),
                    publish: false,
                  };
                  return competitor;
                }
              })
            )
          );
          const levelData: CompetitionByLevel = {
            id: competitionId,
            name: competitionName,
            level: levels?.at(index) ?? '',
            levelID: level,
            players: competitors.filter((element) => {
              return element.rankingData !== 0;
            }),
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

export const getCompetitionData = async (id: string, lang: string): Promise<Competition | null> => {
  const competitionPath = path.join(COMPETITION_DIR, id);
  const jsonPath = path.join(competitionPath, id + '.json');
  if (fs.existsSync(jsonPath)) {
    try {
      const competitionJsonStr = await fs.promises.readFile(jsonPath);
      const competitionJson: CompetitionJson = JSON.parse(
        competitionJsonStr.toString() ?? JSON.stringify({ id: '', name: '' })
      );
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
        explanation: competitionJson.explanations[lang],
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
