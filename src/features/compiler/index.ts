import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { initialize } from '@/features/compiler/initialize';

export const useCompiler = (userLocale: string | null = null): void => {
  const dispacher = useDispatch();
  const { locale } = useRouter();
  const [t] = useTranslation('editor');

  useEffect(() => {
    window.laze = window.laze || {};
    if (window.laze?.compiler === undefined) {
      window.laze.compiler = initialize(dispacher, t);
    }
  }, [dispacher, locale, t, userLocale]);
};
