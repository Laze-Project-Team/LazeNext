import { Button, Tabs } from 'antd';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import type { VFC } from 'react';
import { useDispatch } from 'react-redux';

import { LeaderboardList } from '@/components/ui/LeaderboardList';
import { competeSlice } from '@/features/redux/compete';
import type { CompetitionUIProps } from '@/typings/compete';

import { H1 } from './IndexLayout';

const { TabPane } = Tabs;

export const CompetitionUI: VFC<CompetitionUIProps> = ({ competition }) => {
  const [t] = useTranslation('compete');

  const dispatch = useDispatch();
  const { collapse } = competeSlice.actions;
  const renderCompetition = () => {
    if (competition.levels) {
      return (
        <Tabs
          size="large"
          tabBarGutter={20}
          centered
          onChange={() => {
            dispatch(collapse());
          }}
        >
          {competition.leaderboardList.map((element) => {
            return (
              <TabPane tab={element.level} key={element.level}>
                <div className="flex w-full justify-center">
                  <Link href={`/compete/editor?difficulty=${element.level}`} passHref>
                    <Button type="primary">
                      <p>{t('join', { competition: competition.name, level: element.level })}</p>
                    </Button>
                  </Link>
                </div>
                <br></br>
                <LeaderboardList
                  competitorList={(element ?? { players: [] }).players}
                  sortOrder="Ascending"
                  rankingDataName="Time"
                />
              </TabPane>
            );
          })}
        </Tabs>
      );
    } else {
      return (
        <LeaderboardList
          competitorList={(competition.leaderboardList[0] ?? { players: [] }).players}
          sortOrder="Ascending"
          rankingDataName="Time"
        />
      );
    }
  };
  return (
    <>
      <H1>{competition.name}</H1>
      {renderCompetition()}
    </>
  );
};
