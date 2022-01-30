import { Form, Input } from 'antd';
import { useTranslation } from 'next-i18next';
import type { FieldData } from 'rc-field-form/lib/interface';
import type { VFC } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

type formValues = {
  username: string;
  display_name: string;
  email: string;
  password: string;
  password_confirm: string;
};

export const SignUpForm: VFC = () => {
  const [t] = useTranslation('signup');
  const [fields, setFields] = useState<FieldData[]>([]);

  const submit = (values: formValues) => {
    console.log(values);
  };

  const getField = useCallback(
    (id: string) => {
      return fields.find((field) => {
        const { name } = field;
        if (typeof name === 'string') {
          return name === id;
        }
        if (Array.isArray(name)) {
          return name.includes(id);
        }
      })?.value;
    },
    [fields]
  );

  return (
    <>
      <div className="mx-auto">
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          onFinish={submit}
          onFieldsChange={(_, allFields) => {
            setFields(allFields);
          }}
        >
          <Form.Item
            label={t('form.label.username')}
            name="username"
            rules={[
              { required: true, message: t('form.message.username.required') },
              { min: 3, message: t('form.message.username.minLength') },
              { max: 32, message: t('form.message.username.maxLength') },
              { pattern: /^[a-zA-Z_0-9]+$/, message: t('form.message.username.pattern') },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label={t('form.label.display_name')} name="display_name">
            <Input placeholder={getField('username')} />
          </Form.Item>
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
          <Form.Item
            label={t('form.label.password')}
            name="password"
            rules={[
              { required: true, message: t('form.message.password') },
              { min: 8, message: t('form.message.password.minLength') },
              { pattern: /^[a-zA-Z_0-9]+$/, message: t('form.message.password.pattern') },
            ]}
          >
            <Input.Password
              iconRender={(visible) => {
                return visible ? <AiOutlineEye /> : <AiOutlineEyeInvisible />;
              }}
            />
          </Form.Item>
          <Form.Item
            label={t('form.label.password_confirm')}
            name="password_confirm"
            rules={[
              { required: true, message: t('form.message.password_confirm.required') },
              {
                validator: (_, value, callback) => {
                  if (value !== getField('password')) {
                    callback(t('form.message.password_confirm.notMatch'));
                  }
                  callback();
                },
              },
            ]}
          >
            <Input.Password
              iconRender={(visible) => {
                return visible ? <AiOutlineEye /> : <AiOutlineEyeInvisible />;
              }}
            />
          </Form.Item>
        </Form>
      </div>
    </>
  );
};
