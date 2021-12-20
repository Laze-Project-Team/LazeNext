import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export const Portal: FC = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => {
      return setMounted(false);
    };
  }, []);

  const portal =
    document.getElementById('#editor-portal') ??
    (() => {
      const portal = document.createElement('div');
      portal.id = 'editor-portal';
      document.body.appendChild(portal);
      return portal;
    })();

  return mounted ? createPortal(children, portal) : null;
};
