import type { VFC, FC, ReactChild } from 'react';
import { IconContext } from 'react-icons';
import { Typography } from 'antd';

import { cx } from '@/features/cx';

export type CardProps = {
  title: string;
  description: string;
  textClass?: string;
  icon?: ReactChild;
  className?: string;
};

export const CardContainer: FC = ({ children }) => {
  return (
    <>
      <div className="flex flex-wrap md:space-x-4 space-y-4 md:space-y-0">{children}</div>
    </>
  );
};

export const Card: VFC<CardProps> = ({ title, description, icon, textClass, className }) => (
  <>
    <div
      className={cx(
        'w-full md:flex-1 flex space-x-4 md:flex-col items-center bg-black/10 p-4 rounded-md shadow-md',
        className
      )}
    >
      <div>
        <IconContext.Provider value={{ size: '4rem', color: 'whitesmoke' }}>{icon}</IconContext.Provider>
      </div>
      <div>
        <Typography.Title level={3} className={cx('font-bold !text-xl md:text-center mt-1 mb-2', textClass)}>
          {title}
        </Typography.Title>
        <Typography.Text className={textClass}>{description}</Typography.Text>
      </div>
    </div>
  </>
);
