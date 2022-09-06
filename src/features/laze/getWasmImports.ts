import type { Laze } from '@/typings/laze';

import type { importArduinoProps } from './dependencies/arduino';
import { arduinoModule } from './dependencies/arduino';
import type { importConsoleProps } from './dependencies/console';
import { consoleModule } from './dependencies/console';
import type { importEditorConsoleProps } from './dependencies/editorConsole';
import { editorConsoleModule } from './dependencies/editorConsole';
import type { importStdProps } from './dependencies/std';
import { stdModule } from './dependencies/std';
import type { importWebglProps } from './dependencies/webgl';
import { webglModule } from './dependencies/webgl';
import type { ExecuteParam } from './executeLaze';

export type LazeProps = Partial<
  importConsoleProps & importStdProps & importWebglProps & importArduinoProps & importEditorConsoleProps
>;

export type Libraries = 'std' | 'webgl' | 'arduino' | 'console' | 'editorConsole';

export const getWasmImports = (
  dependencies: Libraries[],
  param: ExecuteParam,
  canvasId = 'output-canvas'
): [LazeProps, WebAssembly.Imports] => {
  const modules: Laze.Modules = {
    std: stdModule,
    console: consoleModule,
    webgl: webglModule,
    arduino: arduinoModule,
    editorConsole: editorConsoleModule,
  };
  const props: LazeProps = dependencies.reduce((result, key) => {
    if (key in modules) {
      const dependency = modules[key] as Laze.Module;
      if (key === 'webgl') {
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
      }
      return { ...result, [key]: dependency.props };
    } else {
      throw new Error(`${key} is not a module that is available.`);
    }
  }, {});
  const importObject: WebAssembly.Imports = dependencies.reduce((result, key) => {
    if (key in modules) {
      const dependency = modules[key] as Laze.Module;
      return { ...result, ...dependency.importFunc(dependency.props) };
    } else {
      throw new Error(`${key} is not a module that is available.`);
    }
  }, {});
  return [props, importObject];
};
