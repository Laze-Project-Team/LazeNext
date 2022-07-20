import type { Element } from 'hast';
import { BsCheckCircleFill } from 'react-icons/bs';
import type { Components } from 'react-markdown';

import { StyledLink } from '@/components/ui/atoms/StyledLink';

export const Info: Components['i'] = ({ children }) => {
  return (
    <p className="my-8 flex space-x-2 bg-[hsl(110,80%,95%)] p-4">
      <BsCheckCircleFill className="text-xl text-[hsl(110,80%,40%)]" />
      <span className="min-w-0 flex-1">{children}</span>
    </p>
  );
};

export const getIdFromChildren = (node: Element) => {
  return (
    node.children
      .find((child) => {
        return child.type === 'text';
      })
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ?.value.replace(/\s/g, '_')
  );
};

export const NavH2: Components['h2'] = ({ node, children }) => {
  return (
    <StyledLink
      key={getIdFromChildren(node)}
      href={`#${getIdFromChildren(node)}`}
      className="block py-1 px-4 text-gray-800 transition-colors hover:bg-blue-100/20"
    >
      {children}
    </StyledLink>
  );
};

export const NavH3: Components['h3'] = ({ node, children }) => {
  return (
    <StyledLink
      key={getIdFromChildren(node)}
      href={`#${getIdFromChildren(node)}`}
      className="ml-4 block py-1 px-4 text-gray-800 transition-colors hover:bg-blue-100/20"
    >
      {children}
    </StyledLink>
  );
};

export const Quote: Components['blockquote'] = ({ children }) => {
  return (
    <blockquote className="my-8">
      <p className="border-l-4 pl-4 text-gray-700">{children}</p>
    </blockquote>
  );
};
