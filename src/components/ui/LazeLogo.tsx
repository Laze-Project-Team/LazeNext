import Image from 'next/image';
import type { VFC } from 'react';

type logoPotion = 'logo' | 'logo_gray' | 'logo_caption' | 'logo_caption_gray';

type LazeLogoProps = {
  size: number;
  option?: logoPotion;
};

const LazeLogo: VFC<LazeLogoProps> = ({ size, option = 'logo' }) => {
  return (
    <>
      <Image
        src={`/img/${option}.png`}
        alt="Lazeのロゴ画像"
        width={size}
        height={size}
        className="select-none pointer-events-none"
      />
    </>
  );
};

LazeLogo.defaultProps = {
  option: 'logo',
};

export { LazeLogo };
