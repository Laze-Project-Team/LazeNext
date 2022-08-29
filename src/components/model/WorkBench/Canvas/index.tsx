import type { FC, RefObject } from 'react';
import { useCallback, useEffect, useRef } from 'react';

import { cx } from '@/features/utils/cx';
import styles from '@/styles/canvas.module.css';

export const CanvasArea: FC = () => {
  const ratioRef = useRef<HTMLDivElement>(null);

  const reflectSizeToCanvas = (ref: RefObject<HTMLDivElement>) => {
    if (ref.current === null) {
      return;
    }

    const parent = ref.current.parentElement as HTMLDivElement;

    if (parent.clientWidth > (parent.clientHeight / 9) * 16) {
      ref.current.style.width = `${(parent.clientHeight / 9) * 16}px`;
    } else {
      ref.current.style.width = 'auto';
    }
  };

  const handleResize = useCallback(() => {
    reflectSizeToCanvas(ratioRef);
  }, []);

  useEffect(() => {
    if (ratioRef.current) {
      const parent = ratioRef.current?.parentElement as HTMLDivElement;
      const observer = new ResizeObserver(() => {
        handleResize();
      });
      observer.observe(parent);
      return () => {
        return observer.disconnect();
      };
    }
  }, [handleResize]);

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
