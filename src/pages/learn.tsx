import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { LearnPage } from '@/components/model/Learn';

const Learn: NextPage = () => {
  const { locale } = useRouter();
  const [t] = useTranslation('learn');
  const title = `${t('title')} | Laze`;

  return (
    <>
      <Head>
        <title>{title}</title>

        <meta content={t('description')} name="description" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={t('description')} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://laze.ddns.net/${locale ? `${locale}/` : ''}learn`} />
        <meta property="og:site_name" content={title} />
        <meta property="og:locale" content={locale ?? 'en'} />
      </Head>

      <LearnPage />
    </>
  );
};

type contextType = {
  locale: string;
};
export const getStaticProps = async (context: contextType) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common', 'learn'])),
    },
  };
};

export default Learn;
