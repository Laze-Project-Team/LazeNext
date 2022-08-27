import type { GetStaticPaths, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { LeaderboardLayout } from '@/components/layout/LeaderboardLayout';
import { CompetitionUI } from '@/components/ui/CompetitionUI';
import { H4 } from '@/components/ui/IndexLayout';
import { SiderUI } from '@/components/ui/SiderUI';
import { getAllCompetitions, getCompetitionData } from '@/features/compete/compete';
import type { Competition } from '@/typings/compete';

type CompeteProps = {
  competitionData: Competition;
  locale: string;
};

const Compete: NextPage<CompeteProps> = ({ competitionData }) => {
  return (
    <>
      <Head>
        <title>Compete</title>
      </Head>
      <LeaderboardLayout sider={<SiderUI />}>
        <H4>
          <Link href="/compete">&lt; BACK TO COMPETE</Link>
        </H4>
        {/* <H1>Leaderboard</H1> */}
        <CompetitionUI competition={competitionData} />
      </LeaderboardLayout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const files = getAllCompetitions();
  const paths = files.map((fileName) => {
    return {
      params: {
        competition: fileName.replace(/\.json$/, ''),
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
};

type contextType = {
  locale: string;
  params: {
    competition: string;
  };
};

export const getStaticProps = async (context: contextType) => {
  const competitionData = getCompetitionData(context.params.competition);
  return {
    props: {
      competitionData,
      ...(await serverSideTranslations(context.locale, ['common', 'layout', 'compete'])),
    },
  };
};

export default Compete;
