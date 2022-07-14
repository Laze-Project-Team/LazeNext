import { BsCheckCircleFill } from 'react-icons/bs';
import type { Components } from 'react-markdown';

export const Info: Components['b'] = ({ children }) => {
  return (
    <div className="my-8 flex space-x-2 bg-[hsl(110,80%,95%)] p-4">
      <BsCheckCircleFill className="text-xl text-[hsl(110,80%,40%)]" />
      <span className="min-w-0 flex-1">{children}</span>
    </div>
  );
};
