import { Tabs } from 'antd';
import type { VFC } from 'react';

import { LeaderboardList } from '@/components/ui/LeaderboardList';
import type { CompetitionUIProps } from '@/typings/compete';

import { H1 } from './IndexLayout';

const { TabPane } = Tabs;

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
