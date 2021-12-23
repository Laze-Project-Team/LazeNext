import type { Components } from 'react-markdown';

export const H1: Components['h1'] = ({ children }) => {
  return <h1 className="text-4xl mb-4">{children}</h1>;
};

export const H2: Components['h2'] = ({ node, children }) => {
  return (
    <h2 className="text-2xl border-b-2" id={node.position?.start.line.toString()}>
      {children}
    </h2>
  );
};

export const HR: Components['hr'] = () => {
  return <hr className="mb-4" />;
};

export const anchorLink: Components['h2'] = ({ node, children }) => {
  return (
    <p className="my-1">
      <a href={'#' + node.position?.start.line.toString()} className="text-gray-400 text-xs">
        {children}
      </a>
    </p>
  );
};
