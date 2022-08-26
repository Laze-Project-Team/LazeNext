import type { NextPage } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { IndexLayout } from '@/components/layout/IndexLayout';
import type { Competition } from '@/components/ui/CompetitionUI';
import { CompetitionUI } from '@/components/ui/CompetitionUI';
import type { Competitor } from '@/components/ui/LeaderboardList';

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

const competition: Competition = {
  name: 'Linetrace',
  levels: ['Easy'],
  leaderboardList: [
    { level: 'Easy', players: competitors },
    { level: 'Medium', players: competitors },
    { level: 'Hard', players: [] },
  ],
};

const Compete: NextPage = () => {
  return (
    <>
      <Head>
        <title>Compete</title>
      </Head>
      <IndexLayout>
        {/* <H1>Leaderboard</H1> */}
        <CompetitionUI competition={competition} />
      </IndexLayout>
    </>
  );
};

type contextType = {
  locale: string;
};
export const getStaticProps = async (context: contextType) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common', 'layout', 'compete'])),
    },
  };
};

export default Compete;
