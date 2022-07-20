import { Anchor, Image } from 'antd';
import type { Components } from 'react-markdown';

import { getIdFromChildren } from '@/components/model/Learn/LearnMarkdown';
import { StyledLink } from '@/components/ui/atoms/StyledLink';
import { cx } from '@/features/utils/cx';
import styles from '@/styles/pre.module.css';

export const H1: Components['h1'] = ({ children }) => {
  return <h1 className="mb-8 text-4xl">{children}</h1>;
};

export const H2: Components['h2'] = ({ node, children }) => {
  return (
    <h2 className="mt-8 mb-4 border-b-2 text-2xl" id={getIdFromChildren(node)}>
      {children}
    </h2>
  );
};

export const H3: Components['h3'] = ({ node, children }) => {
  return (
    <h3 className="mt-8 text-lg font-bold" id={getIdFromChildren(node)}>
      {children}
    </h3>
  );
};

export const H4: Components['h4'] = ({ children }) => {
  return <h4 className="text mt-4 font-bold text-gray-600">{children}</h4>;
};

export const Paragraph: Components['p'] = ({ children }) => {
  if (Array.isArray(children)) {
    if (
      children.some((child) => {
        return typeof child === 'string';
      })
    ) {
      return <p className="leading-6">{children}</p>;
    } else {
      return <>{children}</>;
    }
  } else if (typeof children === 'string') {
    return <p className="leading-6">{children}</p>;
  } else {
    return children;
  }
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

  return <Anchor.Link href={`#${id}`} className="text-xs text-gray-400" title={children} />;
};

export const Pre: Components['pre'] = ({ children }) => {
  return (
    <pre className={cx('rounded-md bg-editor px-4 py-2 text-[#ccc]', styles.pre, styles.scrollable)}>{children}</pre>
  );
};

export const Code: Components['code'] = ({ children }) => {
  return <code className="mx-1 bg-gray-200 px-1 py-[.1rem] font-editor">{children}</code>;
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
    <td className="border-b-[1px] border-gray-200 px-2 py-1" style={{ textAlign: node.properties?.align }}>
      {children}
    </td>
  );
};

export const Img: Components['img'] = ({ src, alt, title }) => {
  return <>{src && <Image src={src} alt={alt} title={title} />}</>;
};
