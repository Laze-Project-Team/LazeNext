import { useTranslation } from 'next-i18next';
import type { FC } from 'react';

export const Footer: FC = () => {
  const [t] = useTranslation('common');

  return (
    <>
      <footer className="bg-gray-200 py-4">
        <div className="text-center text-gray-600">{t('copyright')}</div>
      </footer>
    </>
  );
};
