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
        className="relative inline-flex h-full items-center space-x-1 border-b-2 border-transparent px-3 transition-all ease-linear hover:border-primary-400 hover:text-primary-400 disabled:!text-gray-500 disabled:hover:!border-transparent dark:hover:border-primary-100 dark:hover:text-primary-100 disabled:dark:!text-gray-400"
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
