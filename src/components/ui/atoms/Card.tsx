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
      <div className="flex flex-wrap md:space-x-4 space-y-4 md:space-y-0">{children}</div>
    </>
  );
};

export const Card: FC<CardProps> = ({ children, title, description, icon, textClass, className }) => {
  return (
    <>
      <div
        className={cx(
          'w-full md:flex-1 flex space-x-4 md:space-x-0 md:flex-col items-center bg-black/10 p-4 rounded-md shadow-md',
          className
        )}
      >
        <div>
          <IconContext.Provider value={{ size: '4rem', color: 'whitesmoke' }}>{icon}</IconContext.Provider>
        </div>
        <div className="flex-1 flex flex-col">
          <Typography.Title level={3} className={cx('font-bold !text-xl md:text-center mt-1 mb-2', textClass)}>
            {title}
          </Typography.Title>
          <Typography.Text className={textClass}>{description}</Typography.Text>
          {children}
        </div>
      </div>
    </>
  );
};
