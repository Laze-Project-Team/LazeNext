import type { MutableRefObject, ReactNode } from 'react';
import { useRef } from 'react';
import { createContext } from 'react';

type errorFunc = () => void | PromiseLike<void>;

export const compileErrorContext = createContext<MutableRefObject<errorFunc | null> | null>(null);

export const CompileErrorProvider = ({ children }: { children?: ReactNode }) => {
  const compileError = useRef<errorFunc | null>(null);

  return <compileErrorContext.Provider value={compileError}>{children}</compileErrorContext.Provider>;
};
