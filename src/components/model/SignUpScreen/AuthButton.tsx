import { Button } from 'antd';
import type { ReactNode, VFC } from 'react';

import { cx } from '@/features/utils/cx';

type AuthButtonProps = {
  className?: string;
  icon: ReactNode;
  title: string;
};

export const AuthButton: VFC<AuthButtonProps> = ({ icon, title, className }) => {
  return (
    <>
      <Button
        type="text"
        icon={<div className="inline-block h-6 w-6">{icon}</div>}
        className={cx('!flex items-center space-x-2 !p-4 !shadow-sm hover:!opacity-80', className)}
      >
        {title}
      </Button>
    </>
  );
};
