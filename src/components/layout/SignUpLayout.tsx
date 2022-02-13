import { Divider } from 'antd';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import type { FC, ReactNode } from 'react';

import { WithLink } from '@/components/ui/WithLink';

type SignUpLayoutProps = {
  title: ReactNode;
  authWith: ReactNode;
  form: ReactNode;
  footer: ReactNode;
};

export const SignUpLayout: FC<SignUpLayoutProps> = ({ title, authWith, form, footer }) => {
  const { locale } = useRouter();
  const [t] = useTranslation('signup');

  return (
    <div className="mx-auto max-w-[30rem] px-4 pt-8">
      <h1 className="mb-8 text-center text-2xl">{title}</h1>

      <div className="flex flex-col items-center">
        {authWith}

        <Divider>{t('or')}</Divider>

        <div className="w-full !max-w-[20rem]">{form}</div>
        <div className="mt-8 flex w-full !max-w-[20rem] justify-center">
          <div className="sm:ml-auto">{footer}</div>
        </div>

        <p className="mt-8 text-gray-500">{locale !== 'ja' && <WithLink title={t('common:DeepL')} />}</p>
      </div>
    </div>
  );
};
