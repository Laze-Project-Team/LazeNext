import { Input } from 'antd';
import type { FC } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export const PasswordInput: FC = () => {
  return (
    <Input.Password
      iconRender={(visible) => {
        return visible ? <AiOutlineEye /> : <AiOutlineEyeInvisible />;
      }}
    />
  );
};
