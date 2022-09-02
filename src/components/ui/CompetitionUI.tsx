import { Button, Tabs } from 'antd';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import type { VFC } from 'react';
import { useDispatch } from 'react-redux';

import { LeaderboardList } from '@/components/ui/LeaderboardList';
import { linetraceTemplate } from '@/const/linetraceSample';
import { competeSlice } from '@/features/redux/compete';
import { explorerSlice } from '@/features/redux/explorer';
import type { CompetitionByLevel, CompetitionUIProps } from '@/typings/compete';

import { H1 } from './IndexLayout';

const { TabPane } = Tabs;

export const CompetitionUI: VFC<CompetitionUIProps> = ({ competition }) => {
  const [t] = useTranslation('compete');

  const dispatch = useDispatch();
  const { collapse, updateCompetition } = competeSlice.actions;
  const { setDirectory } = explorerSlice.actions;

  const onEditorLink = (level: string) => {
    dispatch(
      setDirectory({
        projectName: '',
        directory: {
          '/main.laze': {
            type: 'file',
            content: linetraceTemplate[level],
            isRenaming: false,
          },
        },
      })
    );
  };

  const renderCompetition = () => {
    if (competition.levels) {
      return (
        <Tabs
          size="large"
          tabBarGutter={20}
          centered
          onChange={(activeKey) => {
            dispatch(collapse());
            if (competition.leaderboardList.length > 0) {
              const competitionData: CompetitionByLevel = { ...competition.leaderboardList[0], level: activeKey };
              dispatch(updateCompetition(competitionData));
            }
          }}
        >
          {competition.leaderboardList.map((element) => {
            return (
              <TabPane tab={element.level} key={element.level}>
                <div className="flex w-full justify-center">
                  <Link
                    href={`/compete/editor?id=${competition.id}&name=${competition.name}&level=${element.level}`}
                    passHref
                  >
                    <Button
                      type="primary"
                      onClick={() => {
                        onEditorLink(element.level);
                      }}
                    >
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
