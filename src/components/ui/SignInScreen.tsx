import { useRouter } from 'next/router';
import type { VFC } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import { auth } from '@/features/firebase';

import { useAuthContext } from '../model/Context/AuthContext';

export const SignInScreen: VFC = () => {
  const router = useRouter();
  const { locale } = router;
  const [isShown, setIsShown] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    setIsShown(true);
    auth.languageCode = router.locale ?? 'en';
  }, [router.locale]);

  useEffect(() => {
    if (user) {
      router.push('/profile', undefined, { locale });
    }
  }, [locale, router, user]);

  if (isShown) {
    return <div className="my-16"></div>;
  }

  return <div></div>;
};
