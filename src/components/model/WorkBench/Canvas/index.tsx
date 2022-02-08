import type { FC } from 'react';
import { useContext } from 'react';

import { cx } from '@/features/utils/cx';
import { ratioRefContext } from '@/pages/editor';
import styles from '@/styles/canvas.module.css';

export const CanvasArea: FC = () => {
  const ratioRef = useContext(ratioRefContext);

  return (
    <>
      <div className="flex h-full items-center">
        <div ref={ratioRef} className="mx-auto aspect-video">
          <canvas
            id="output-canvas"
            width="1280"
            height="720"
            className={cx('h-full w-full bg-white', styles.canvas)}
          />
        </div>
      </div>
    </>
  );
};
