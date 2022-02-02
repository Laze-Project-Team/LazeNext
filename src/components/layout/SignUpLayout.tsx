import { Divider } from 'antd';
import type { FC, ReactNode } from 'react';

type SignUpLayoutProps = {
  title: string;
  authWith: ReactNode;
  form: ReactNode;
};

export const SignUpLayout: FC<SignUpLayoutProps> = ({ title, authWith, form }) => {
  return (
    <div className="mx-auto max-w-[30rem] px-4 pt-8">
      <h1 className="mb-8 text-center text-2xl">{title}</h1>

      <div className="flex flex-col items-center">
        {authWith}

        <Divider>{t('or')}</Divider>

        <div className="w-full !max-w-[20rem]">{form}</div>
      </div>
    </div>
  );
};
