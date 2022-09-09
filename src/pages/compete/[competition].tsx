import { notification } from 'antd';
import type { GetStaticPaths, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';

import { LeaderboardLayout } from '@/components/layout/LeaderboardLayout';
import { CompetitionUI } from '@/components/ui/CompetitionUI';
import { H4 } from '@/components/ui/IndexLayout';
import { getAllCompetitions, getCompetitionData } from '@/features/compete/compete';
import { competeSlice } from '@/features/redux/compete';
import type { Competition } from '@/typings/compete';

const Compete: NextPage = () => {
  const [t] = useTranslation('compete');
  const { locale, query } = useRouter();
  const competitionName = query.competition as string;

  const openFetchError = (errorItem: string) => {
    notification.open({
      message: t(`fetch ${errorItem} error`),
      description: t(`fetch ${errorItem} error message`),
    });
  };

  const fetchCompetitionData = async () => {
    const res = await fetch(`/api/compete/getcompetition?id=${competitionName}&lang=${locale}`);
    if (res.ok) {
      return res.json();
    } else {
      openFetchError('compData');
    }
  };
  const competitionData = useQuery('competitionData', fetchCompetitionData);

  const dispatch = useDispatch();
  const { updateCompetition } = competeSlice.actions;

  useEffect(() => {
    if (competitionData.isFetched && competitionData.data) {
      const data = competitionData.data as Competition;
      if (data.leaderboardList.length > 0) {
        dispatch(updateCompetition(data.leaderboardList[0]));
      }
    }
  }, [dispatch, updateCompetition, competitionData]);

  return (
    <>
      <Head>
        <title>{t('compete')}</title>

        <meta name="robots" content="noindex" />
      </Head>
      <LeaderboardLayout>
        <H4>
          <Link href="/compete" passHref>
            <a>&lt; {t('backToCompete')}</a>
          </Link>
        </H4>
        {competitionData.isFetched ? <CompetitionUI competition={competitionData.data} /> : <p>Loading...</p>}
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
  const competitionData = await getCompetitionData(context.params.competition, context.locale);
  return {
    props: {
      competitionData,
      ...(await serverSideTranslations(context.locale, ['common', 'layout', 'compete'])),
    },
  };
};

export default Compete;
