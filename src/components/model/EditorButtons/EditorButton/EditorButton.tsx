import type { FC } from 'react';

type EditorButtonProps = {
  name: string;
  onClick: () => void;
  disabled?: boolean;
  Icon: React.ReactElement;
};

export const EditorButton: FC<EditorButtonProps> = ({ name, onClick, Icon, disabled, children }) => {
  return (
    <>
      <button
        type="button"
        className="inline-flex relative items-center space-x-1 h-full px-3 border-b-2 transition-all ease-linear border-transparent hover:border-primary-400 hover:text-primary-400 dark:hover:border-primary-100 dark:hover:text-primary-100 disabled:hover:!border-transparent disabled:!text-gray-500 disabled:dark:!text-gray-400"
        onClick={onClick}
        disabled={disabled ?? false}
      >
        {Icon}
        <span>{name}</span>
        {children}
      </button>
    </>
  );
};
