import { Input } from 'antd';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export const PasswordInput = (
  <Input.Password
    iconRender={(visible) => {
      return visible ? <AiOutlineEye /> : <AiOutlineEyeInvisible />;
    }}
  />
);
