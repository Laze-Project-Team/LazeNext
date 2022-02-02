import { Button, Form, Input, Spin } from 'antd';
import { isSignInWithEmailLink, signInWithEmailLink, updatePassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import type { FC } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import { PasswordInput } from '@/components/ui/atoms/PasswordInput';
import { WithLink } from '@/components/ui/WithLink';
import { auth } from '@/features/firebase';

type viewStateType = 'processing' | 'require_email' | 'error' | 'require_password' | 'success';

type SubmitButtonType = {
  isLoading: boolean;
};

const SubmitButton: FC<SubmitButtonType> = ({ children, isLoading }) => {
  return (
    <Form.Item wrapperCol={{ span: 16 }}>
      <Button type="primary" htmlType="submit" className="mt-4" loading={isLoading}>
        {children}
      </Button>
    </Form.Item>
  );
};

export const SignupCompleteScreen: FC = () => {
  const router = useRouter();
  const { locale } = router;
  const [t] = useTranslation('signup_complete');
  const [viewState, setViewState] = useState<viewStateType>('processing');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const signInWithEmail = (email: string) => {
    signInWithEmailLink(auth, email, location.href)
      .then(() => {
        setViewState('require_password');
        setIsSubmitting(false);
      })
      .catch(() => {
        setViewState('error');
        setIsSubmitting(false);
      });
  };

  const emailSubmit = (values: { email: string }) => {
    signInWithEmail(values.email);
    setIsSubmitting(true);
  };

  const passwordSubmit = (values: { password: string }) => {
    setIsSubmitting(true);
    if (auth.currentUser) {
      updatePassword(auth.currentUser, values.password)
        .then(() => {
          setViewState('success');
          setIsSubmitting(false);
        })
        .catch(() => {
          setViewState('error');
          setIsSubmitting(false);
        });
    } else {
      setViewState('error');
    }
  };

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.localStorage.getItem('emailForSignIn');
      if (email === null) {
        setViewState('require_email');
        return;
      }
      signInWithEmail(email);
    } else {
      router.push('/', undefined, { locale });
    }
  }, [locale, router]);

  switch (viewState) {
    case 'processing':
      return (
        <div className="flex w-full flex-col items-center space-y-4">
          <Spin size="large" />
          <h2 className="text-xl font-bold">{t('processing.title')}</h2>
          <p>
            <WithLink title={t('processing.message')} />
          </p>
        </div>
      );
    case 'require_email':
      return (
        <div className="flex w-full flex-col space-y-4">
          <h2 className="text-xl font-bold">{t('require_email.title')}</h2>
          <Form wrapperCol={{ span: 24 }} labelCol={{ span: 24 }} onFinish={emailSubmit}>
            <Form.Item
              label={t('require_email.email.label')}
              name="email"
              rules={[
                { required: true, message: t('require_email.email.required') },
                {
                  type: 'email',
                  message: t('require_email.email.invalid'),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <SubmitButton isLoading={isSubmitting}>{t('require_email.submit')}</SubmitButton>
          </Form>
        </div>
      );
    case 'require_password':
      return (
        <div className="flex w-full flex-col">
          <h2 className="text-xl font-bold">{t('require_password.title')}</h2>
          <Form wrapperCol={{ span: 24 }} labelCol={{ span: 24 }} onFinish={passwordSubmit}>
            <Form.Item
              label={t('require_password.password.label')}
              name="password"
              rules={[
                { required: true, message: t('require_password.password.required') },
                {
                  min: 8,
                  message: t('require_password.password.min'),
                },
              ]}
            >
              <PasswordInput />
            </Form.Item>
            <SubmitButton isLoading={isSubmitting}> {t('require_password.submit')}</SubmitButton>
          </Form>
        </div>
      );
    case 'success':
      return (
        <div className="w-full">
          <h2 className="text-xl font-bold">{t('success.title')}</h2>
          <p>
            <WithLink title={t('success.message')} />
          </p>
        </div>
      );
    case 'error':
      return (
        <div className="red-[#ff4d4f] w-full">
          <WithLink title={t('error')} />
        </div>
      );
    default:
      return <></>;
  }
};
