import { Spin } from 'antd';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';

import { WithLink } from '@/components/ui/WithLink';
import { auth } from '@/features/firebase';

const SignupComplete: NextPage = () => {
  const router = useRouter();
  const { locale } = router;
  const [t] = useTranslation('signup_complete');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const title = `${t('title')} | Laze`;

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (email === null) {
        email = window.prompt(t('prompt'));
      }
      if (email === null) {
        setError(true);
        return;
      }
      signInWithEmailLink(auth, email, window.location.href)
        .then(() => {
          window.localStorage.removeItem('emailForSignIn');
          setSuccess(true);
        })
        .catch(() => {
          setError(true);
        });
    } else {
      router.push('/', undefined, { locale });
    }
  }, [locale, router, t]);

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
      </Head>

      <h1 className="hidden">{t('title')}</h1>

      <div className="flex h-screen w-screen flex-col items-center justify-center space-y-4">
        {success ? (
          <>
            <div>
              <p className="text-lg">{t('success.title')}</p>
              <p>
                <WithLink title={t('success.message')} />
              </p>
            </div>
          </>
        ) : error ? (
          <>
            <div className="red-[#ff4d4f]">
              <WithLink title={t('error')} />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <Spin size="large" />
              <p className="text-lg">{t('loading.title')}</p>
              <div>
                <WithLink title={t('loading.message')} />
              </div>
            </div>
          </>
        )}
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
