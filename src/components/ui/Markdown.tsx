import { Anchor } from 'antd';
import type { Components } from 'react-markdown';

import { StyledLink } from './atoms/StyledLink';

export const H1: Components['h1'] = ({ children }) => {
  return <h1 className="text-4xl mb-4">{children}</h1>;
};

export const H2: Components['h2'] = ({ node, children }) => {
  return (
    <h2 className="text-2xl border-b-2 mt-8" id={node.position?.start.line.toString()}>
      {children}
    </h2>
  );
};

export const Paragraph: Components['p'] = ({ children }) => {
  return <p className="leading-6">{children}</p>;
};

export const HR: Components['hr'] = () => {
  return <hr className="mb-4" />;
};

export const a: Components['a'] = ({ href, children }) => {
  const address = href?.startsWith('/') ? `/docs${href}` : href;
  return (
    <StyledLink href={address ?? ''} className="">
      {children}
    </StyledLink>
  );
};

export const anchorLink: Components['h2'] = ({ node, children }) => {
  return (
    <Anchor.Link href={'#' + node.position?.start.line.toString()} className="text-gray-400 text-xs" title={children} />
  );
};
