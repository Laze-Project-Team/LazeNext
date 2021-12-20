import Link from 'next/link';
import type { ForwardRefRenderFunction, ReactNode } from 'react';
import { forwardRef } from 'react';

export type StyledLinkProps = {
  children: ReactNode;
  href: string;
  className?: string;
  onClick?: () => void;
};

const ForwardedStyledLink: ForwardRefRenderFunction<HTMLAnchorElement, StyledLinkProps> = (
  { children, onClick, href, className },
  ref
) => {
  return (
    <Link href={href} passHref>
      <a href={href} className={className} onClick={onClick} ref={ref}>
        {children}
      </a>
    </Link>
  );
};

export const StyledLink = forwardRef<HTMLAnchorElement, StyledLinkProps>(ForwardedStyledLink);
