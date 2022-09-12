import { Button, Tabs } from 'antd';
import Image from 'next/image';
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

  const onEditorLink = (levelID: string) => {
    dispatch(
      setDirectory({
        projectName: '',
        directory: {
          '/main.laze': {
            type: 'file',
            content: linetraceTemplate[levelID],
            isRenaming: false,
          },
        },
      })
    );
  };

  const renderCompetition = () => {
    if (competition.levels && competition.levelIDs) {
      return (
        <Tabs
          size="large"
          tabBarGutter={20}
          centered
          onChange={(activeKey) => {
            dispatch(collapse());
            const level =
              competition.leaderboardList.find((element) => {
                return element.levelID === activeKey;
              })?.level ?? '';
            if (competition.leaderboardList.length > 0) {
              const competitionData: CompetitionByLevel = {
                ...competition.leaderboardList[0],
                levelID: activeKey,
                level,
              };
              dispatch(updateCompetition(competitionData));
            }
          }}
        >
          {competition.leaderboardList.map((element) => {
            return (
              <TabPane tab={element.level} key={element.levelID}>
                {competition.imageForLevels && competition.imageForLevels[element.levelID] ? (
                  <div className="mx-auto w-4/12 p-4">
                    <Image
                      src={competition.imageForLevels[element.levelID]}
                      alt="linetrace"
                      layout="responsive"
                      width="640"
                      height="360"
                    />
                  </div>
                ) : (
                  <></>
                )}

                <div className="flex w-full justify-center">
                  <Link
                    href={`/compete/editor?id=${competition.id}&name=${competition.name}&level=${element.level}&levelID=${element.levelID}`}
                    passHref
                  >
                    <Button
                      type="primary"
                      onClick={() => {
                        onEditorLink(element.levelID);
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
      <span>{competition.explanation}</span>
      <br></br>
      <span>{t('leaderboard_explanation')}</span>
      {renderCompetition()}
    </>
  );
};
