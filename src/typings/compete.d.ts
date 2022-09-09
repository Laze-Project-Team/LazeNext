export type CompetitionByLevel = {
  id: string;
  name: string;
  level: string;
  levelID: string;
  players: Competitor[];
};

export type Competition = {
  id: string;
  name: string;
  leaderboardList: CompetitionByLevel[];
  levels?: string[];
  levelIDs?: string[];
  explanation: string;
  imageForLevels?: Record<string, string>;
};

export type CompetitionJson = {
  id: string;
  name: Record<string, string>;
  explanations: Record<string, string>;
  imageForLevels?: Record<string, string>;
  levelIDs?: string[];
  levels?: Record<string, string[]>;
};

export type CompetitionUIProps = {
  competition: Competition;
};

export type Competitor = {
  id: string;
  rankingData: number;
  programUrl: string;
  ranking: number;
  wasmUrl: string;
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

export type CompetitorInfoJson = {
  id: string;
  time: number;
};
