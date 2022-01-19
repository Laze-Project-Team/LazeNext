import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import type { VFC } from 'react';

import { cx } from '@/features/utils/cx';
import logo from '~/public/img/logo/logo.png';
import logo_caption from '~/public/img/logo/logo_caption.png';
import logo_caption_gray from '~/public/img/logo/logo_caption_gray.png';
import logo_gray from '~/public/img/logo/logo_gray.png';

type logoPotion = 'logo' | 'logo_gray' | 'logo_caption' | 'logo_caption_gray';

type LazeLogoProps = {
  size: number;
  option?: logoPotion;
  className?: string;
};

const images: Record<logoPotion, StaticImageData> = {
  logo,
  logo_caption,
  logo_gray,
  logo_caption_gray,
};

export const LazeLogo: VFC<LazeLogoProps> = ({ size, option = 'logo', className }) => {
  const [t] = useTranslation('common');

  return (
    <>
      <div className={cx('inline-flex select-none pointer-events-none', className)}>
        <Image src={images[option]} alt={t('lazelogo')} width={size} height={size} />
      </div>
    </>
  );
};

LazeLogo.defaultProps = {
  option: 'logo',
};
