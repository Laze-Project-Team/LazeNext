export type CompetitionByLevel = {
  level: string;
  players: Competitor[];
};

export type Competition = {
  id: string;
  name: string;
  leaderboardList: CompetitionByLevel[];
  levels?: string[];
};

export type CompetitionJson = {
  id: string;
  name: string;
  levels?: string[];
};

export type CompetitionUIProps = {
  competition: Competition;
};

export type Competitor = {
  id: string;
  rankingData: number;
  programUrl: string;
  ranking: number;
};

export type LeaderboardListProps = {
  competitorList: Competitor[] | null;
  sortOrder: 'Ascending' | 'Descending';
  rankingDataName: string;
};

export type GetcompetitorRequest = {
  name: string;
  level?: string;
};
