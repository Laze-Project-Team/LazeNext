import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import type { VFC } from 'react';

import { cx } from '@/features/utils/cx';

type logoPotion = 'logo' | 'logo_gray' | 'logo_caption' | 'logo_caption_gray';

type LazeLogoProps = {
  size: number;
  option?: logoPotion;
  className?: string;
};

export const LazeLogo: VFC<LazeLogoProps> = ({ size, option = 'logo', className }) => {
  const [t] = useTranslation('common');

  return (
    <>
      <div className={cx('inline-flex select-none pointer-events-none', className)}>
        <Image src={`/img/logo/${option}.png`} alt={t('lazelogo')} width={size} height={size} />
      </div>
    </>
  );
};

LazeLogo.defaultProps = {
  option: 'logo',
};
