/* eslint-disable react/jsx-no-target-blank */
import Link from 'next/link';
import type { FC, ReactNode } from 'react';
import { BiLinkExternal } from 'react-icons/bi';

export type StyledLinkProps = {
  children: ReactNode;
  href: string;
  className?: string;
  title?: string;
  onClick?: () => void;
  iconDisabled?: boolean;
};

export const StyledLink: FC<StyledLinkProps> = ({ children, onClick, href, className, title, iconDisabled }) => {
  const isInternal = href.startsWith('/') || href.startsWith('#');
  return (
    <Link href={href} passHref>
      <a
        href={href}
        className={className}
        onClick={onClick}
        target={isInternal ? undefined : '_blank'}
        rel={isInternal ? undefined : 'noopener noreferrer'}
        title={title}
      >
        {children}
        {!iconDisabled && (isInternal || <BiLinkExternal className="ml-1 inline" />)}
      </a>
    </Link>
  );
};
