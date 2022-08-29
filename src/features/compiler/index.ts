import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { initialize } from '@/features/compiler/initialize';
import { getProps } from '@/features/compiler/initialize/getProps';

export const useCompiler = (): void => {
  const dispacher = useDispatch();
  const [t] = useTranslation('editor');

  useEffect(() => {
    window.laze = window.laze || {};
    if (window.laze?.props === undefined) {
      window.laze.props = getProps(null, dispacher);
    }
    if (window.laze?.compiler === undefined) {
      window.laze.compiler = initialize(dispacher, t);
    }
  }, [dispacher, t]);
};
