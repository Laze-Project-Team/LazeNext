import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { SignupCompleteScreen } from '@/components/model/SignUpCompleteScreen';
import { WithLink } from '@/components/ui/WithLink';

const SignupComplete: NextPage = () => {
  const { locale } = useRouter();
  const [t] = useTranslation('signup_complete');
  const title = `${t('title')} | Laze`;

  return (
    <>
      <Head>
        <title>{title}</title>

        <meta content={t('description')} name="description" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={t('description')} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://laze.ddns.net/${locale ? `${locale}/` : ''}signup_complete`} />
        <meta property="og:site_name" content={title} />
        <meta property="og:locale" content={locale ?? 'en'} />

        <meta name="robots" content="noindex" />
      </Head>

      <h1 className="hidden">{t('title')}</h1>

      <div className="mx-auto flex max-w-[30rem] flex-col items-center justify-center space-y-4 px-4 pt-8">
        <SignupCompleteScreen />

        <p className="!mt-8 text-gray-500">{locale !== 'ja' && <WithLink title={t('common:DeepL')} />}</p>
      </div>
    </>
  );
};

type contextType = {
  locale: string;
};
export const getStaticProps = async (context: contextType) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common', 'signup_complete'])),
    },
  };
};

export default SignupComplete;
