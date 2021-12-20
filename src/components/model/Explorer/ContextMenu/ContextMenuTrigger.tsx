import type { FC } from 'react';
import { useContextMenu } from 'react-contexify';

type ContextMenuTriggerProps = {
  id: string;
  path: string;
  className?: string;
};

export const ContextMenuTrigger: FC<ContextMenuTriggerProps> = ({ id, path, className, children }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { show } = useContextMenu({ id });
  const handleContextMenu = (event: React.MouseEvent<HTMLParagraphElement, MouseEvent>, index: string) =>
    {return show(event, { props: { index } })};

  return (
    <>
      <div className={className} onContextMenu={(e) => {return handleContextMenu(e, path)}}>
        {children}
      </div>
    </>
  );
};

ContextMenuTrigger.defaultProps = {
  className: '',
};
