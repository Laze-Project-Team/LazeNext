import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect } from 'react';

import { SignUpLayout } from '@/components/layout/SignUpLayout';
import { useAuthContext } from '@/components/model/Context/AuthContext';
import { LogInForm } from '@/components/model/LogInScreen/LogInForm';
import { AuthButtons } from '@/components/model/SignUpScreen/AuthButtons';
import { WithLink } from '@/components/ui/WithLink';

const Privacy: NextPage = () => {
  const router = useRouter();
  const { locale } = router;
  const { user } = useAuthContext();
  const [t] = useTranslation('login');
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
        <meta property="og:url" content={`https://laze.ddns.net/${locale ? `${locale}/` : ''}login`} />
        <meta property="og:site_name" content={title} />
        <meta property="og:locale" content={locale ?? 'en'} />

        <meta name="robots" content="noindex" />
      </Head>

      <SignUpLayout
        title={t('title')}
        authWith={
          <AuthButtons
            title={{ google: t('auth.google'), twitter: t('auth.twitter'), github: t('auth.github') }}
            error={{
              'account-exists-with-different-credential': t('error.account-exists-with-different-credential'),
              'too-many-requests': t('error.too-many-requests'),
              unknown: t('error.unknown'),
            }}
          />
        }
        form={<LogInForm />}
        footer={<WithLink title={t('footer')} />}
      />
    </>
  );
};

type contextType = {
  locale: string;
};
export const getStaticProps = async (context: contextType) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common', 'login', 'signup', 'layout'])),
    },
  };
};

export default Privacy;
