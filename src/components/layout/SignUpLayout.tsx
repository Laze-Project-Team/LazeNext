import { Divider } from 'antd';
import { useTranslation } from 'next-i18next';
import type { FC, ReactNode } from 'react';

type SignUpLayoutProps = {
  authWith: ReactNode;
  form: ReactNode;
};

export const SignUpLayout: FC<SignUpLayoutProps> = ({ authWith, form }) => {
  const [t] = useTranslation('signup');

  return (
    <div className="mx-auto max-w-[30rem] px-4 pt-8">
      <h1 className="mb-8 text-center text-2xl">{t('title')}</h1>

      <div className="flex flex-col items-center">
        {authWith}

        <Divider>{t('or')}</Divider>

        <div className="w-full !max-w-[20rem]">{form}</div>
      </div>
    </div>
  );
};
