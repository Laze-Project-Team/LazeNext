import Image from 'next/image';
import type { VFC } from 'react';

import { cx } from '@/features/utils/cx';

type logoPotion = 'logo' | 'logo_gray' | 'logo_caption' | 'logo_caption_gray';

type LazeLogoProps = {
  size: number;
  option?: logoPotion;
  className?: string;
};

export const LazeLogo: VFC<LazeLogoProps> = ({ size, option = 'logo', className }) => {
  return (
    <>
      <div className={cx('inline-flex select-none pointer-events-none', className)}>
        <Image src={`/img/${option}.png`} alt="Lazeのロゴ画像" width={size} height={size} />
      </div>
    </>
  );
};

LazeLogo.defaultProps = {
  option: 'logo',
};
