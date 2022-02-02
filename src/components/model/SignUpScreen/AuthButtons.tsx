import { message } from 'antd';
import type { AuthProvider } from 'firebase/auth';
import { TwitterAuthProvider } from 'firebase/auth';
import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import type { VFC } from 'react';
import { useEffect } from 'react';

import { AuthButton } from '@/components/model/SignUpScreen/AuthButton';
import { GitHubIcon } from '@/components/ui/atoms/icons/GitHubIcon';
import { GoogleIcon } from '@/components/ui/atoms/icons/GoogleIcon';
import { TwitterIcon } from '@/components/ui/atoms/icons/TwitterIcon';
import { auth } from '@/features/firebase';

const GoogleProvider = new GoogleAuthProvider();
const TwitterProvider = new TwitterAuthProvider();
const GitHubProvider = new GithubAuthProvider();

export const AuthButtons: VFC = () => {
  const router = useRouter();
  const [t] = useTranslation('signup');

  const authWith = (provider: AuthProvider) => {
    signInWithPopup(auth, provider)
      .then(() => {
        router.push('/profile');
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/account-exists-with-different-credential':
            message.error(t('error.account-exists-with-different-credential'));
            break;
          case 'auth/popup-closed-by-user':
            return;
          default:
            message.error(t('error.authwith-unknown'));
        }
      });
  };

  useEffect(() => {
    auth.languageCode = router.locale ?? 'en';
  }, [router.locale]);

  return (
    <div className="flex flex-col space-y-4 px-4">
      <AuthButton
        onClick={() => {
          authWith(GoogleProvider);
        }}
        className="!bg-white"
        icon={<GoogleIcon />}
        title={t('auth.signup.google')}
      />
      <AuthButton
        onClick={() => {
          authWith(TwitterProvider);
        }}
        className="!bg-[#03A9F4] !text-white"
        icon={<TwitterIcon />}
        title={t('auth.signup.twitter')}
      />
      <AuthButton
        onClick={() => {
          authWith(GitHubProvider);
        }}
        className="!bg-gray-700 !text-white"
        icon={<GitHubIcon />}
        title={t('auth.signup.github')}
      />
    </div>
  );
};
