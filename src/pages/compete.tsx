import type { NextPage } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { IndexLayout } from '@/components/layout/IndexLayout';
import { H1 } from '@/components/ui/IndexLayout';

const Compete: NextPage = () => {
  return (
    <>
      <Head>
        <title>Compete!</title>
      </Head>
      <IndexLayout>
        <H1>Leaderboard</H1>
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
