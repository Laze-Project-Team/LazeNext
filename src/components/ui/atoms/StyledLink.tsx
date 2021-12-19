import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';

type StyledLinkProps = {
  children: ReactNode;
  href: string;
  className?: string;
  onClick?: () => void;
};

export const StyledLink = forwardRef<HTMLAnchorElement, StyledLinkProps>(
  ({ children, onClick, href, className }, ref) => (
    <Link href={href} passHref>
      <a href={href} className={className} onClick={onClick} ref={ref}>
        {children}
      </a>
    </Link>
  )
);
