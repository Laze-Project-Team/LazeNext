import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import type { VFC } from 'react';
import { useEffect } from 'react';

import { AuthButton } from '@/components/model/SignInScreen/AuthButton';
import { GitHubIcon } from '@/components/ui/atoms/icons/GitHubIcon';
import { GoogleIcon } from '@/components/ui/atoms/icons/GoogleIcon';
import { TwitterIcon } from '@/components/ui/atoms/icons/TwitterIcon';
import { auth } from '@/features/firebase';

export const SignInScreen: VFC = () => {
  const router = useRouter();
  const [t] = useTranslation('signup');

  useEffect(() => {
    auth.languageCode = router.locale ?? 'en';
  }, [router.locale]);

  return (
    <div className="flex">
      <div className="space-y-4">
        <AuthButton icon={<GoogleIcon />} title={t('auth.signup.google')}></AuthButton>
        <AuthButton icon={<TwitterIcon className="text-[#03A9F4]" />} title={t('auth.signup.twitter')}></AuthButton>
        <AuthButton icon={<GitHubIcon className="text-black" />} title={t('auth.signup.github')}></AuthButton>
      </div>
      <div className=""></div>
    </div>
  );
};
