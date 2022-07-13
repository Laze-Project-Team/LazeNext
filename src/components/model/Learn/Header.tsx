import type { FC } from 'react';

import { LazeLogo } from '@/components/ui/atoms/LazeLogo';

export const Header: FC = () => {
  return (
    <>
      <header className="flex px-4 py-2 shadow-sm">
        <div className="inline-flex items-center space-x-1">
          <LazeLogo size={32} />
          <span className="select-none text-2xl text-laze-primary">Laze</span>
        </div>
      </header>
    </>
  );
};
