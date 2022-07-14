import type { ReactElement } from 'react';
import type { Components } from 'react-markdown';

import { Editor } from './Editor';

export const Pre: Components['pre'] = ({ children }) => {
  const code = children[0] as ReactElement;

  console.log(code);

  const className = code.props?.className as string | undefined;
  if (className && className.split(' ').includes('language-laze')) {
    const value = code.props.children.join('');
    const [initialValue, placeholder] = value.split('---\n');

    return <Editor initialValue={initialValue} placeholder={placeholder} />;
  }

  return (
    <>
      <p></p>
    </>
  );
};
