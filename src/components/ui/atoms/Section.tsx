import type { FC } from 'react';

import { cx } from '@/features/utils/cx';

export type classNameProps = {
  className?: string;
};

export const SectionContainer: FC<classNameProps> = ({ children, className }) => {
  return (
    <>
      <div className={cx('mx-[-100rem] px-[100rem] pt-6 pb-10', className)}>{children}</div>
    </>
  );
};

export const SectionTitle: FC<classNameProps> = ({ children, className }) => {
  return (
    <>
      <h2 className="mb-6">
        <span className={cx('border-b-4 pl-2 pr-10 pb-[0.1rem] text-2xl', className)}>{children}</span>
      </h2>
    </>
  );
};
