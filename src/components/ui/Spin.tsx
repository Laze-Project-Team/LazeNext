import type { FC } from 'react';

import { cx } from '@/features/utils/cx';

type SpinProps = {
  className?: string;
};

export const Spin: FC<SpinProps> = ({ children, className }) => {
  return (
    <>
      <div className={cx('animate-spin', className)}>{children}</div>
    </>
  );
};
