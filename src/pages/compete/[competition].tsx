import type { GetStaticPaths, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { LeaderboardLayout } from '@/components/layout/LeaderboardLayout';
import { CompetitionUI } from '@/components/ui/CompetitionUI';
import { H4 } from '@/components/ui/IndexLayout';
import { SiderUI } from '@/components/ui/SiderUI';
import { getAllCompetitions, getCompetitionData } from '@/features/compete/compete';
import type { RootState } from '@/features/redux/root';
import type { Competition, Competitor } from '@/typings/compete';

type CompeteProps = {
  competitionData: Competition;
  locale: string;
};

const Compete: NextPage<CompeteProps> = ({ competitionData }) => {
  const [t] = useTranslation('compete');

  const competitor = useSelector<RootState, Competitor>((state) => {
    return state.compete.competitor;
  });
  useEffect(() => {
    window.laze = window.laze || {};
  });
  return (
    <>
      <Head>
        <title>{t('compete')}</title>

        <meta name="robots" content="noindex" />
      </Head>
      <LeaderboardLayout sider={<SiderUI key={competitor.id} />}>
        <H4>
          <Link href="/compete" passHref>
            <a>&lt; {t('backToCompete')}</a>
          </Link>
        </H4>
        <CompetitionUI competition={competitionData} />
      </LeaderboardLayout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const files = await getAllCompetitions();
  const paths = files.flatMap((fileName) => {
    return ['en', 'ja'].map((locale) => {
      return {
        params: {
          competition: fileName.replace(/\.json$/, ''),
        },
        locale: locale,
      };
    });
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
  const competitionData = await getCompetitionData(context.params.competition);
  return {
    props: {
      competitionData,
      ...(await serverSideTranslations(context.locale, ['common', 'layout', 'compete'])),
    },
  };
};

export default Compete;