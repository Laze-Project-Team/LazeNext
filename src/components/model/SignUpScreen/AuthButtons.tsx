import { message } from 'antd';
import type { AuthProvider } from 'firebase/auth';
import { TwitterAuthProvider } from 'firebase/auth';
import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/router';
import type { VFC } from 'react';
import { useEffect } from 'react';

import { AuthButton } from '@/components/model/SignUpScreen/AuthButton';
import { GitHubIcon } from '@/components/ui/atoms/icons/GitHubIcon';
import { GoogleIcon } from '@/components/ui/atoms/icons/GoogleIcon';
import { TwitterIcon } from '@/components/ui/atoms/icons/TwitterIcon';
import { WithLink } from '@/components/ui/WithLink';
import { auth } from '@/features/firebase';

const GoogleProvider = new GoogleAuthProvider();
const TwitterProvider = new TwitterAuthProvider();
const GitHubProvider = new GithubAuthProvider();

type AuthButtonsProps = {
  title: {
    google: string;
    twitter: string;
    github: string;
  };
  error: Record<string, string | null> & { unknown: string };
};

export const AuthButtons: VFC<AuthButtonsProps> = ({ title, error }) => {
  const router = useRouter();
  const enhancedError: Record<string, string | null> & { unknown: string } = {
    ...error,
    'popup-closed-by-user': null,
    'cancelled-popup-request': null,
  };

  const authWith = (provider: AuthProvider) => {
    signInWithPopup(auth, provider)
      .then(() => {
        router.push('/profile');
      })
      .catch((err) => {
        let unknown = true;
        Object.keys(enhancedError).forEach((key) => {
          if (key !== 'unknown' && err.code === `auth/${key}`) {
            unknown = false;
            const errorMessage = enhancedError[key];
            if (errorMessage !== null) {
              message.error(<WithLink title={errorMessage} />);
            }
          }
        });
        if (unknown) {
          message.error(enhancedError.unknown);
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
        title={title.google}
      />
      <AuthButton
        onClick={() => {
          authWith(TwitterProvider);
        }}
        className="!bg-[#03A9F4] !text-white"
        icon={<TwitterIcon />}
        title={title.twitter}
      />
      <AuthButton
        onClick={() => {
          authWith(GitHubProvider);
        }}
        className="!bg-gray-700 !text-white"
        icon={<GitHubIcon />}
        title={title.github}
      />
    </div>
  );
};
