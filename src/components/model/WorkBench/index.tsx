import type { VFC } from 'react';
import { useTranslation } from 'react-i18next';

import Console from '@/components/model/WorkBench/Console';
import { CanvasArea } from '@/components/model/WorkBench/Canvas';
import SwitchPanes from '@/components/model/WorkBench/SwitchPanes';
import { SwitchPaneObject } from '@/components/model/WorkBench/SwitchPanes';

export type paneType = 'output' | 'canvas';

export const WorkBench: VFC = () => {
  const [t] = useTranslation('editor');

  const workBenchPanes: Record<paneType, SwitchPaneObject> = {
    output: { label: t('Output'), element: <Console /> },
    canvas: { label: t('Canvas Area'), element: <CanvasArea /> },
  };

  return (
    <>
      <div className="dark:bg-editor h-full">
        <SwitchPanes panes={workBenchPanes} initialPane="output" />
      </div>
    </>
  );
};
