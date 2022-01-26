import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { IndexLayout } from '@/components/layout/IndexLayout';
import { H1, H2, P } from '@/components/ui/IndexLayout';
import { WithLink } from '@/components/ui/WithLink';

const Privacy: NextPage = () => {
  const { locale } = useRouter();
  const [t] = useTranslation('privacy');
  const title = `${t('title')} | Laze`;

  return (
    <>
      <Head>
        <title>{title}</title>

        <meta content={t('description')} name="description" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={t('description')} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://laze.ddns.net/${locale + '/' ?? ''}privacy`} />
        <meta property="og:site_name" content={title} />
        <meta property="og:locale" content={locale ?? 'en'} />
      </Head>

      <IndexLayout>
        <H1>{t('title')}</H1>
        <H2>{t('Administrator.title')}</H2>
        <P>{t('Administrator.1')}</P>
        <H2>{t('CollectingInfomation.title')}</H2>
        <P>{t('CollectingInfomation.1')}</P>
        <H2>{t('WhatToUse.title')}</H2>
        <P>{t('WhatToUse.1')}</P>
        <H2>{t('GoogleAnalytics.title')}</H2>
        <P>{t('GoogleAnalytics.1')}</P>
        <P>
          <WithLink title={t('GoogleAnalytics.2')} />
        </P>

        <P className="mt-8 mb-16">{locale !== 'ja' && <WithLink title={t('common:DeepL')} />}</P>
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
      ...(await serverSideTranslations(context.locale, ['common', 'privacy', 'layout'])),
    },
  };
};

export default Privacy;
