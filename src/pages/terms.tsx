import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { IndexLayout } from '@/components/layout/IndexLayout';
import { H1, H2, LI, OL, P } from '@/components/ui/IndexLayout';
import { WithLink } from '@/components/ui/WithLink';

const Terms: NextPage = () => {
  const { locale } = useRouter();
  const [t] = useTranslation(['terms', 'common']);
  const title = `${t('title')} | Laze`;

  return (
    <>
      <Head>
        <title>{title}</title>

        <meta content={t('description')} name="description" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={t('description')} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://laze.ddns.net/${locale + '/' ?? ''}terms`} />
        <meta property="og:site_name" content={title} />
        <meta property="og:locale" content={locale ?? 'en'} />
      </Head>

      <IndexLayout>
        <H1>{t('title')}</H1>
        <P>{t('declaration')}</P>

        <H2>{t('1.title')}</H2>
        <OL>
          <LI>{t('1.1')}</LI>
          <LI>{t('1.2')}</LI>
          <LI>{t('1.3')}</LI>
        </OL>

        <H2>{t('2.title')}</H2>
        <P>{t('2.0')}</P>
        <OL>
          <LI>{t('2.1')}</LI>
          <LI>{t('2.2')}</LI>
          <LI>{t('2.3')}</LI>
          <LI>{t('2.4')}</LI>
          <LI>{t('2.5')}</LI>
          <LI>{t('2.6')}</LI>
          <LI>{t('2.7')}</LI>
          <LI>{t('2.8')}</LI>
          <LI>{t('2.9')}</LI>
          <LI>{t('2.10')}</LI>
          <LI>{t('2.11')}</LI>
          <LI>{t('2.12')}</LI>
          <LI>{t('2.13')}</LI>
          <LI>{t('2.14')}</LI>
          <LI>{t('2.15')}</LI>
        </OL>

        <H2>{t('3.title')}</H2>
        <OL>
          <LI>{t('3.1.title')}</LI>
          <OL>
            <LI>{t('3.1.1')}</LI>
            <LI>{t('3.1.2')}</LI>
            <LI>{t('3.1.3')}</LI>
            <LI>{t('3.1.4')}</LI>
          </OL>
          <LI>{t('3.2')}</LI>
        </OL>

        <H2>{t('4.title')}</H2>
        <OL>
          <LI>{t('4.1.title')}</LI>
          <OL>
            <LI>{t('4.1.1')}</LI>
            <LI>{t('4.1.2')}</LI>
          </OL>
          <LI>{t('4.2')}</LI>
        </OL>

        <H2>{t('5.title')}</H2>
        <OL>
          <LI>{t('5.1')}</LI>
          <LI>{t('5.2')}</LI>
          <LI>{t('5.3')}</LI>
        </OL>

        <H2>{t('6.title')}</H2>
        <OL>
          <LI>{t('6.1')}</LI>
        </OL>

        <H2>{t('7.title')}</H2>
        <OL>
          <LI>{t('7.1')}</LI>
        </OL>

        <H2>{t('8.title')}</H2>
        <OL>
          <LI>
            <WithLink title={t('8.1')} />
          </LI>
        </OL>

        <H2>{t('9.title')}</H2>
        <OL>
          <LI>{t('9.1')}</LI>
        </OL>

        <H2>{t('10.title')}</H2>
        <OL>
          <LI>{t('10.1')}</LI>
          <LI>{t('10.2')}</LI>
          <LI>{t('10.3')}</LI>
        </OL>

        <P className="mt-8 mb-16">{locale !== 'ja' && t('common:deepL')}</P>
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
      ...(await serverSideTranslations(context.locale, ['common', 'terms', 'layout'])),
    },
  };
};

export default Terms;
