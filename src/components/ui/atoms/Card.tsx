import { Typography } from 'antd';
import type { FC, ReactChild } from 'react';
import { IconContext } from 'react-icons';

import { cx } from '@/features/utils/cx';

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
      <div className="flex flex-wrap space-y-4 md:space-x-4 md:space-y-0">{children}</div>
    </>
  );
};

export const Card: FC<CardProps> = ({ children, title, description, icon, textClass, className }) => {
  return (
    <>
      <div
        className={cx(
          'flex w-full items-center space-x-4 rounded-md bg-black/10 p-4 shadow-md md:flex-1 md:flex-col md:space-x-0',
          className
        )}
      >
        <div>
          <IconContext.Provider value={{ size: '4rem', color: 'whitesmoke' }}>{icon}</IconContext.Provider>
        </div>
        <div className="flex flex-1 flex-col">
          <Typography.Title level={3} className={cx('mt-1 mb-2 !text-xl font-bold md:text-center', textClass)}>
            {title}
          </Typography.Title>
          <Typography.Text className={textClass}>{description}</Typography.Text>
          {children}
        </div>
      </div>
    </>
  );
};
