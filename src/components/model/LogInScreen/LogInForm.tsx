import { Button, Form, Input, message } from 'antd';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import type { VFC } from 'react';
import { useState } from 'react';

import { PasswordInput } from '@/components/ui/atoms/PasswordInput';
import { auth } from '@/features/firebase';

const handleCode = [
  'user-not-found',
  'wrong-password',
  'too-many-requests',
  'account-exists-with-different-credential',
];

export const LogInForm: VFC = () => {
  const router = useRouter();
  const [t] = useTranslation('login');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const submit = (values: { email: string; password: string }) => {
    setIsSubmitting(true);
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then(() => {
        router.back();
      })
      .catch((error) => {
        setIsSubmitting(false);
        const errorCode = error.code.slice(error.code.lastIndexOf('/') + 1);
        if (handleCode.includes(errorCode)) {
          message.error(t(`error.${errorCode}`));
        } else {
          message.error(t('error.unknown'));
        }
      });
  };

  return (
    <>
      <Form onFinish={submit} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
        <Form.Item
          label={t('form.label.email')}
          name="email"
          rules={[
            { required: true, message: t('form.message.email') },
            { type: 'email', message: t('form.message.email.invalid') },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t('form.label.password')}
          name="password"
          rules={[{ required: true, message: t('form.message.password') }]}
        >
          {PasswordInput}
        </Form.Item>
        <Form.Item>
          <Button className="mt-4" type="primary" htmlType="submit" loading={isSubmitting}>
            {t('form.label.submit')}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
