import type { VFC } from 'react';
import { useTranslation } from 'react-i18next';

import { CanvasArea } from '@/components/model/WorkBench/Canvas';
import { Console } from '@/components/model/WorkBench/Console';
import type { SwitchPaneObject } from '@/components/model/WorkBench/SwitchPanes';
import { SwitchPane } from '@/components/model/WorkBench/SwitchPanes';

export type paneType = 'output' | 'canvas';

export const WorkBench: VFC = () => {
  const [t] = useTranslation('editor');

  const workBenchPanes: Record<paneType, SwitchPaneObject> = {
    output: { label: t('workbench.output'), element: <Console /> },
    canvas: { label: t('workbench.canvas'), element: <CanvasArea /> },
  };

  return (
    <>
      <div className="h-full dark:bg-editor">
        <SwitchPane panes={workBenchPanes} initialPane="output" />
      </div>
    </>
  );
};
