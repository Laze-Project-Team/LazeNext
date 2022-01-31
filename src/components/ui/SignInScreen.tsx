import { Button } from 'antd';
import { useRouter } from 'next/router';
import type { VFC } from 'react';
import { useEffect } from 'react';

import { useAuthContext } from '@/components/model/Context/AuthContext';
import { auth } from '@/features/firebase';

export const SignInScreen: VFC = () => {
  const router = useRouter();
  const { locale } = router;
  const { user } = useAuthContext();

  useEffect(() => {
    auth.languageCode = router.locale ?? 'en';
  }, [router.locale]);

  useEffect(() => {
    if (user) {
      router.push('/profile', undefined, { locale });
    }
  }, [locale, router, user]);

  return (
    <div>
      <Button></Button>
    </div>
  );
};
