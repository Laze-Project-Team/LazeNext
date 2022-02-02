import { Button, Form, Input } from 'antd';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import type { VFC } from 'react';
import { useState } from 'react';

import { PasswordInput } from '@/components/ui/atoms/PasswordInput';
import { auth } from '@/features/firebase';

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
        // message.error(t('error'));
        console.log(error.code);
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
            { type: 'email', message: 'error' },
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
