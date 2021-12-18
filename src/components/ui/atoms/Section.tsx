import type { FC } from 'react';

import { cx } from '@/features/cx';

export type classNameProps = {
  className?: string;
};

export const SectionContainer: FC<classNameProps> = ({ children, className }) => (
  <>
    <div className={cx('mx-[-100rem] px-[100rem] pt-6 pb-10', className)}>{children}</div>
  </>
);

export const SectionTitle: FC<classNameProps> = ({ children, className }) => (
  <>
    <h2 className="mb-6">
      <span className={cx('text-2xl border-b-4 pl-2 pr-10 pb-[0.1rem]', className)}>{children}</span>
    </h2>
  </>
);
