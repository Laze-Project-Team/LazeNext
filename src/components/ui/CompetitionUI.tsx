import { Tabs } from 'antd';
import type { VFC } from 'react';

import type { Competitor } from '@/components/ui/LeaderboardList';
import { LeaderboardList } from '@/components/ui/LeaderboardList';

import { H1 } from './IndexLayout';

const { TabPane } = Tabs;

export type CompetitionByLevel = {
  level?: string;
  players: Competitor[];
};

export type Competition = {
  name: string;
  leaderboardList: CompetitionByLevel[];
  levels?: string[];
};

type CompetitionUIProps = {
  competition: Competition;
};

export const CompetitionUI: VFC<CompetitionUIProps> = ({ competition }) => {
  return (
    <>
      <H1>{competition.name}</H1>
      <Tabs size="large" tabBarGutter={20} centered>
        {competition.leaderboardList.map((element) => {
          return (
            <TabPane tab={element.level} key={element.level}>
              <LeaderboardList competitorList={element.players} sortOrder="Ascending" rankingDataName="Time" />
            </TabPane>
          );
        })}
      </Tabs>
    </>
  );
};
