import { Anchor } from 'antd';
import type { Components } from 'react-markdown';

import { StyledLink } from '@/components/ui/atoms/StyledLink';
import { cx } from '@/features/utils/cx';
import styles from '@/styles/pre.module.css';

export const H1: Components['h1'] = ({ children }) => {
  return <h1 className="text-4xl mb-8">{children}</h1>;
};

export const H2: Components['h2'] = ({ node, children }) => {
  const id = node.children.find((child) => {
    return child.type === 'text';
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  })?.value;

  return (
    <h2 className="text-2xl border-b-2 mt-8 mb-4" id={id}>
      {children}
    </h2>
  );
};

export const H3: Components['h3'] = ({ children }) => {
  return <h3 className="text-lg font-bold">{children}</h3>;
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
  const id = node.children.find((child) => {
    return child.type === 'text';
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  })?.value;

  return <Anchor.Link href={`#${id}`} className="text-gray-400 text-xs" title={children} />;
};

export const Pre: Components['pre'] = ({ children }) => {
  return (
    <pre className={cx('bg-editor px-4 py-2 rounded-md text-[#ccc]', styles.pre, styles.scrollable)}>{children}</pre>
  );
};

export const Code: Components['code'] = ({ children }) => {
  return <code className="bg-gray-200 px-1 py-[.1rem] mx-1 font-editor">{children}</code>;
};

export const Table: Components['table'] = ({ children }) => {
  return <table className="my-2 min-w-[20rem]">{children}</table>;
};

export const Thead: Components['thead'] = ({ children }) => {
  return <thead className="border-b-[1px] border-gray-400">{children}</thead>;
};

export const Tbody: Components['tbody'] = ({ children }) => {
  return <tbody>{children}</tbody>;
};

export const Tr: Components['tr'] = ({ children }) => {
  return <tr>{children}</tr>;
};

export const Th: Components['th'] = ({ node, children }) => {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <th className="px-4" style={{ textAlign: node.properties?.align }}>
      {children}
    </th>
  );
};

export const Td: Components['td'] = ({ children, node }) => {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <td className="px-2 py-1 border-b-[1px] border-gray-200" style={{ textAlign: node.properties?.align }}>
      {children}
    </td>
  );
};
