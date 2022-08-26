import fs from 'fs';
import path from 'path';

import { COMPETITION_DIR } from '@/const/dir';
import type { Competition, CompetitionJson, Competitor } from '@/typings/compete';

export const getAllCompetitions = (): string[] => {
  return fs.readdirSync(COMPETITION_DIR);
};

const competitors: Competitor[] = [
  {
    id: 'Soma',
    ranking: 0,
    rankingData: 15.07,
    programUrl: '/program/Soma',
  },
  { id: 'NGT', ranking: 0, rankingData: 3.14, programUrl: '/program/Soma' },
  { id: 'Tak', ranking: 0, rankingData: 50.87, programUrl: '/program/Soma' },
  { id: 'Uei', ranking: 0, rankingData: 80.87, programUrl: '/program/Soma' },
  { id: 'Uei', ranking: 0, rankingData: 80.87, programUrl: '/program/Soma' },
  { id: 'Uei', ranking: 0, rankingData: 80.87, programUrl: '/program/Soma' },
  { id: 'Uei', ranking: 0, rankingData: 80.87, programUrl: '/program/Soma' },
  { id: 'Uei', ranking: 0, rankingData: 80.87, programUrl: '/program/Soma' },
  { id: 'Uei', ranking: 0, rankingData: 80.87, programUrl: '/program/Soma' },
  { id: 'Uei', ranking: 0, rankingData: 80.87, programUrl: '/program/Soma' },
  { id: 'Uei', ranking: 0, rankingData: 80.87, programUrl: '/program/Soma' },
  { id: 'Uei', ranking: 0, rankingData: 80.87, programUrl: '/program/Soma' },
  { id: 'Uei', ranking: 0, rankingData: 80.87, programUrl: '/program/Soma' },
  { id: 'Uei', ranking: 0, rankingData: 80.87, programUrl: '/program/Soma' },
  { id: 'Uei', ranking: 0, rankingData: 80.87, programUrl: '/program/Soma' },
];

export const getCompetitionData = (id: string): Competition => {
  const fullPath = path.join(COMPETITION_DIR, id + '.json');
  const competitionJson: CompetitionJson = JSON.parse(
    fs.readFileSync(fullPath).toString() ?? JSON.stringify({ name: '' })
  );
  const competition: Competition = {
    ...competitionJson,
    leaderboardList: [
      { level: 'Easy', players: competitors },
      { level: 'Medium', players: competitors },
      { level: 'Hard', players: [] },
    ],
  };
  return competition;
};
