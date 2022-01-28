import type { FC } from 'react';

import { cx } from '@/features/utils/cx';

type IndexLayoutComponentProps = {
  children: React.ReactNode;
  className?: string;
};

export const H1: FC<IndexLayoutComponentProps> = ({ children, className }) => {
  return <h1 className={cx('mt-4 mb-8 border-b-[1px] border-gray-400 pb-2 text-3xl', className)}>{children}</h1>;
};

export const H2: FC<IndexLayoutComponentProps> = ({ children, className }) => {
  return <h2 className={cx('mb-4 mt-8 text-xl font-normal', className)}>{children}</h2>;
};

export const H3: FC<IndexLayoutComponentProps> = ({ children, className }) => {
  return <h3 className={cx('text-lg font-bold text-gray-700', className)}>{children}</h3>;
};

export const H4: FC<IndexLayoutComponentProps> = ({ children, className }) => {
  return <h4 className={cx('font-semibold', className)}>{children}</h4>;
};

export const P: FC<IndexLayoutComponentProps> = ({ children, className }) => {
  return <p className={className}>{children}</p>;
};

export const OL: FC<IndexLayoutComponentProps> = ({ children, className }) => {
  return <ol className={cx('list-decimal space-y-1 pb-4 pl-8', className)}>{children}</ol>;
};

export const LI: FC<IndexLayoutComponentProps> = ({ children, className }) => {
  return <li className={className}>{children}</li>;
};

export const UL: FC<IndexLayoutComponentProps> = ({ children, className }) => {
  return <ul className={cx('list-disc space-y-2 pl-8', className)}>{children}</ul>;
};
