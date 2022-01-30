import { EmailAuthProvider, GoogleAuthProvider, TwitterAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/router';
import type { VFC } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { auth } from '@/features/firebase';

import { useAuthContext } from '../model/Context/AuthContext';

const uiConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [EmailAuthProvider.PROVIDER_ID, GoogleAuthProvider.PROVIDER_ID, TwitterAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult: () => {
      return false;
    },
  },
};

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
    return (
      <div className="my-16">
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
      </div>
    );
  }

  return <></>;
};
