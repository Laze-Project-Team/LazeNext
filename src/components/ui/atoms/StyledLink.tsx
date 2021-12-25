/* eslint-disable react/jsx-no-target-blank */
import Link from 'next/link';
import type { FC, ReactNode } from 'react';
import { BiLinkExternal } from 'react-icons/bi';

export type StyledLinkProps = {
  children: ReactNode;
  href: string;
  className?: string;
  onClick?: () => void;
};

export const StyledLink: FC<StyledLinkProps> = ({ children, onClick, href, className }) => {
  const isInternal = href.startsWith('/');
  return (
    <Link href={href} passHref>
      <a
        href={href}
        className={className}
        onClick={onClick}
        target={isInternal ? undefined : '_blank'}
        rel={isInternal ? undefined : 'noopener noreferrer'}
      >
        {children}
        {isInternal || <BiLinkExternal className="ml-1 inline" />}
      </a>
    </Link>
  );
};
