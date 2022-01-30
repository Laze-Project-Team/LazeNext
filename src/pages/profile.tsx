import { Avatar, Skeleton } from 'antd';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useMemo } from 'react';

import { IndexLayout } from '@/components/layout/IndexLayout';
import { useAuthContext } from '@/components/model/Context/AuthContext';
import { UserAvatar } from '@/components/model/Profiles/UserAvatar';

const Profile: NextPage = () => {
  const router = useRouter();
  const { locale } = router;
  const [t] = useTranslation('profile');

  const { user } = useAuthContext();

  const title = useMemo(() => {
    if (user) {
      return `${t('title', { name: user?.displayName })} | Laze`;
    } else {
      return `${t('loading')} | Laze`;
    }
  }, [t, user]);

  useEffect(() => {
    if (user === null) {
      router.push('/signup', undefined, { locale });
    }
  }, [router, locale, user]);

  return (
    <>
      <Head>
        <title>{title}</title>

        <meta content={t('description')} name="description" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={t('description')} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://laze.ddns.net/${locale + '/' ?? ''}profile`} />
        <meta property="og:site_name" content={title} />
        <meta property="og:locale" content={locale ?? 'en'} />
      </Head>

      <IndexLayout>
        <div className="flex">
          <div>
            <div className="my-4">
              <Avatar className="!h-[20vw] max-h-[12rem] !w-[20vw] max-w-[12rem]" icon={<UserAvatar />} />
            </div>
            <div>{user ? <p className="text-xl">{user.displayName}</p> : <Skeleton active />}</div>
          </div>
        </div>
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
      ...(await serverSideTranslations(context.locale, ['common', 'profile', 'layout'])),
    },
  };
};

export default Profile;
