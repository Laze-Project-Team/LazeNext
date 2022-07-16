import type { ReactElement } from 'react';
import type { Components } from 'react-markdown';

import { Editor } from './Editor';

export const Pre: Components['pre'] = ({ children }) => {
  const code = children[0] as ReactElement;
  const codeValue = code.props.children as string[];

  const className = code.props?.className as string | undefined;
  if (className && className.split(' ').includes('language-laze')) {
    const value = codeValue.join('');
    const [initialValue, placeholder] = value.split('---\n');

    return <Editor initialValue={initialValue} placeholder={placeholder} />;
  }

  return (
    <>
      <pre className="my-8 flex rounded-sm bg-gray-100 font-editor">
        <code className="select-none bg-gray-200 px-2 py-2">
          {codeValue
            .join('')
            .split('\n')
            .map((_, i) => {
              return i + 1;
            })
            .filter((_, i, arr) => {
              return i < arr.length - 1;
            })
            .join('\n')}
        </code>
        <code className="px-2 py-2 font-editor">{codeValue}</code>
      </pre>
    </>
  );
};
