import { ConfigProvider } from 'antd';
import type { FC } from 'react';

import type { colorModeType } from '@/pages/_app';

type ColorModeProps = {
  colorMode: colorModeType;
};

// ConfigProvider.config({
//   theme: {
//     primaryColor: '#888888',
//   },
// });

export const ColorMode: FC<ColorModeProps> = ({ children, colorMode }) => {
  return (
    <>
      {colorMode === 'dark' ? (
        <>
          <ConfigProvider>{children}</ConfigProvider>
        </>
      ) : (
        <>
          <ConfigProvider>{children}</ConfigProvider>
        </>
      )}
    </>
  );
};
