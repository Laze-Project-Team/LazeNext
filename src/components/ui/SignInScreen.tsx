import { EmailAuthProvider, GoogleAuthProvider, TwitterAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/router';
import type { VFC } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { auth } from '@/features/firebase';

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
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    setIsShown(true);

    const unregisterAuthObserver = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        // router.push('/profile');
      }
    });
    return () => {
      return unregisterAuthObserver();
    };
  }, [router]);

  if (isShown) {
    return (
      <div>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
      </div>
    );
  }

  return <></>;
};
