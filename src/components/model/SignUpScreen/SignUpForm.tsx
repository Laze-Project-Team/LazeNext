import type { FormItemProps, FormProps } from 'antd';
import { Button } from 'antd';
import { Form, Input } from 'antd';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import type { VFC } from 'react';
import { useState } from 'react';

import { WithLink } from '@/components/ui/WithLink';
import { auth } from '@/features/firebase';

type formValues = {
  email: string;
};

const formItemLayout: FormProps = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const tailFormItemLayout: FormItemProps = {
  wrapperCol: {
    span: 24,
    offset: 0,
  },
};

export const SignUpForm: VFC = () => {
  const { locale } = useRouter();
  const [t] = useTranslation('signup');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const submit = (values: formValues) => {
    setIsSubmitting(true);
    const actionCodeSettings = {
      url: `${location.protocol}//${location.host}/${locale ? `${locale}/` : ''}signup_complete`,
      handleCodeInApp: true,
    };
    sendSignInLinkToEmail(auth, values.email, actionCodeSettings)
      .then(() => {
        localStorage.setItem('emailForSignIn', values.email);
        setIsSuccess(true);
      })
      .catch((error) => {
        if (error.code === 'email-already-in-use') {
          setError(t('error.email-already-in-use'));
        } else {
          setError(t('error.unknown'));
        }
      });
  };

  return (
    <>
      {isSuccess ? (
        <div>
          <p className="font-bold">{t('success.title')}</p>
          <p>{t('success.message')}</p>
        </div>
      ) : (
        <Form onFinish={submit} {...formItemLayout}>
          <Form.Item
            label={t('form.label.email')}
            name="email"
            rules={[
              { required: true, message: t('form.message.email.required') },
              { type: 'email', message: t('form.message.email.invalid') },
            ]}
          >
            <Input />
          </Form.Item>
          {error && (
            <p className="my-4 text-sm text-[#ff4d4f]">
              <WithLink title={error} />
            </p>
          )}
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              {t('form.label.submit')}
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
};
