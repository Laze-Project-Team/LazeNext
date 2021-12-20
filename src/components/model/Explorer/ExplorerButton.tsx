import type { FC, ReactNode } from 'react';
import { IconContext } from 'react-icons';

type ExplorerButtonProps = {
  children: ReactNode;
  onClick: () => void;
  title: string;
};

export const ExplorerButton: FC<ExplorerButtonProps> = ({ children, onClick, title }) => {return (
  <>
    <button type="button" onClick={onClick} title={title} className="p-1 rounded-sm hover:bg-white/10">
      <IconContext.Provider value={{ size: '1.1rem', color: '#eee' }}>{children}</IconContext.Provider>
    </button>
  </>
)};
