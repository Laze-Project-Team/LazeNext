import type { Laze } from '@/typings/laze';

import type { importArduinoProps } from './dependencies/arduino';
import { arduinoModule } from './dependencies/arduino';
import type { importConsoleProps } from './dependencies/console';
import { consoleModule } from './dependencies/console';
import type { importEditorConsoleProps } from './dependencies/editorConsole';
import { editorConsoleModule } from './dependencies/editorConsole';
import type { importGraphicsProps } from './dependencies/graphics';
import { graphicsModule } from './dependencies/graphics';
import type { importLinetraceProps } from './dependencies/linetrace';
import { linetraceModule } from './dependencies/linetrace';
import type { importStdProps } from './dependencies/std';
import { stdModule } from './dependencies/std';
import type { ExecuteParam } from './executeLaze';

export type Libraries = 'std' | 'graphics' | 'arduino' | 'console' | 'editorConsole' | 'linetrace';

export type LazeProps = Partial<
  importConsoleProps &
    importStdProps &
    importGraphicsProps &
    importArduinoProps &
    importEditorConsoleProps &
    importLinetraceProps
>;

export const getWasmImports = (dependencies: Libraries[], param: ExecuteParam): [LazeProps, WebAssembly.Imports] => {
  const modules: Laze.Modules = {
    std: stdModule,
    console: consoleModule,
    graphics: graphicsModule,
    arduino: arduinoModule,
    editorConsole: editorConsoleModule,
    linetrace: linetraceModule,
  };
  const props: LazeProps = dependencies.reduce((result, key) => {
    if (key in modules) {
      const dependency = modules[key] as Laze.Module;
      const canvasId = param.canvasId ?? 'output-canvas';
      if (key === 'graphics') {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) {
          throw new Error(`Could not find canvas of id ${canvasId}`);
        }
        const gl = canvas.getContext('webgl');
        if (!gl) {
          throw new Error('WebGL not supported');
        }
        dependency.props.canvas = canvas;
        dependency.props.gl = gl;
      }
      if (key === 'editorConsole') {
        dependency.props.id = param.id;
        if (param.dispatcher) {
          dependency.props.dispatcher = param.dispatcher;
        }
      }
      if (key === 'linetrace') {
        dependency.props.linetraceTime = param.linetraceTime ?? { time: 0 };
        dependency.props.levelNow = param.levelNow ?? '';
      }
      return { ...result, ...dependency.initFunc(dependency.props) };
    } else {
      throw new Error(`${key} is not a module that is available.`);
    }
  }, {});
  const importObject: WebAssembly.Imports = dependencies.reduce((result, key) => {
    if (key in modules) {
      const dependency = modules[key] as Laze.Module;
      return { ...result, ...dependency.importFunc(props) };
    } else {
      throw new Error(`${key} is not a module that is available.`);
    }
  }, {});
  return [props, importObject];
};
