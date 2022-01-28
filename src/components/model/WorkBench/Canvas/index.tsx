import type { FC } from 'react';
import { useContext } from 'react';

import { ratioRefContext } from '@/pages/editor';

export const CanvasArea: FC = () => {
  const ratioRef = useContext(ratioRefContext);

  return (
    <>
      <div className="flex h-full items-center">
        <div ref={ratioRef} className="mx-auto aspect-video">
          <canvas id="output-canvas" width="1280" height="720" className="h-full w-full bg-white" />
        </div>
      </div>
    </>
  );
};
