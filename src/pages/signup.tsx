import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect } from 'react';

import { useAuthContext } from '@/components/model/Context/AuthContext';
import { SignInScreen } from '@/components/model/SignUpScreen';

const Privacy: NextPage = () => {
  const router = useRouter();
  const { locale } = router;
  const { user } = useAuthContext();
  const [t] = useTranslation('signup');
  const title = `${t('title')} | Laze`;

  useEffect(() => {
    if (user) {
      router.push('/profile', undefined, { locale });
    }
  }, [locale, router, user]);

  return (
    <>
      <Head>
        <title>{title}</title>

        <meta content={t('description')} name="description" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={t('description')} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://laze.ddns.net/${locale ? `${locale}/` : ''}signup`} />
        <meta property="og:site_name" content={title} />
        <meta property="og:locale" content={locale ?? 'en'} />
      </Head>

      <div className="mx-auto max-w-[30rem] px-4 pt-8">
        <h1 className="mb-8 text-center text-2xl">{t('title')}</h1>

        <SignInScreen />
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
      ...(await serverSideTranslations(context.locale, ['common', 'signup', 'layout'])),
    },
  };
};

export default Privacy;
