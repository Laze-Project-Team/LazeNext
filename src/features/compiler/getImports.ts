import type { Dispatch } from 'redux';

import { loadTexture } from '@/features/compiler/initialize/loadStructure';
import { updatePosition } from '@/features/compiler/initialize/updatePosition';
import { consoleSlice } from '@/features/redux/console';
import { sleep } from '@/features/utils/sleep';
import type { getCompleteImportsFunction, getImportsProps, importObject } from '@/typings/compiler';

export const getImports = (dispatcher: Dispatch, props: getImportsProps): getCompleteImportsFunction => {
  const { canvas, gl, variables } = props;
  const { memory } = variables;

  const imports = {
    performance: {
      now: () => {
        return performance.now();
      },
    },
    js: {
      mem: memory,
      checkKeyPress: (keyCode: number) => {
        return BigInt(variables.keyControl.pressedKeys[keyCode]);
      },
      checkMousePress: () => {
        return BigInt(variables.keyControl.mousePressed);
      },
      checkRelativeMouseX: () => {
        return variables.keyControl.relativeMouseX;
      },
      checkRelativeMouseY: () => {
        return variables.keyControl.relativeMouseY;
      },
      checkAbsoluteMouseX: () => {
        return variables.keyControl.absoluteMouseX;
      },
      checkAbsoluteMouseY: () => {
        return variables.keyControl.absoluteMouseY;
      },
      rand: () => {
        return Math.random();
      },
      alloc: (size: number) => {
        const oldMemorySize = variables.memorySize;
        variables.memorySize += size;

        return oldMemorySize;
      },
      lockPointer: () => {
        const requestPointerLock = () => {
          return canvas.requestPointerLock();
        };
        canvas.removeEventListener('click', requestPointerLock, false);
        canvas.addEventListener('click', requestPointerLock, false);

        const handleMouseMove = (e: MouseEvent) => {
          return updatePosition(e, canvas);
        };

        const lockChangeAlert = () => {
          if (document.pointerLockElement === canvas) {
            document.addEventListener('mousemove', handleMouseMove, false);
          } else {
            document.removeEventListener('mousemove', handleMouseMove, false);
          }
        };

        document.removeEventListener('pointerlockchange', lockChangeAlert, false);
        document.addEventListener('pointerlockchange', lockChangeAlert, false);
      },
    },
    webgl: {
      clearColor: (r: number, g: number, b: number, a: number) => {
        gl.clearColor(r, g, b, a);
      },
      clear: (i: number) => {
        gl.clear(i);
      },
      clearDepth: (i: number) => {
        gl.clearDepth(i);
      },
      depthFunc: (i: number) => {
        gl.depthFunc(i);
      },
      blendFunc: (i: number, j: number) => {
        gl.blendFunc(i, j);
      },
      enable: (i: number) => {
        gl.enable(i);
      },
      vertexAttribPointer: (
        index: number,
        size: number,
        type: number,
        normalized: number,
        stride: number,
        offset: number
      ) => {
        gl.vertexAttribPointer(index, size, type, false, stride, offset);
      },
      enableVertexAttribArray: (index: number) => {
        gl.enableVertexAttribArray(index);
      },
      disable: (i: number) => {
        gl.disable(i);
      },
      createProgram: () => {
        const { webglPrograms } = window.laze.props.webglObjects;

        const program = gl.createProgram();
        if (program) {
          webglPrograms.push(program);
        } else {
          throw new Error('Failed to create program');
        }

        return webglPrograms.length - 1;
      },
      createBuffer: () => {
        const { webglBuffers } = window.laze.props.webglObjects;

        const buffer = gl.createBuffer();
        if (buffer) {
          webglBuffers.push(buffer);
        } else {
          throw new Error('Failed to create the buffer object');
        }

        return webglBuffers.length - 1;
      },
      bindBuffer: (i: number, j: number) => {
        const { webglBuffers } = window.laze.props.webglObjects;

        gl.bindBuffer(i, webglBuffers[j]);
      },
      bufferData: (i: number, offset: number, size: number, j: number) => {
        const buffer = memory.buffer.slice(offset, size * 8 + offset);
        const f64Array = new Float64Array(buffer);
        const f32Array = Float32Array.from(f64Array);
        gl.bufferData(i, f32Array, j);
      },
      elementBufferData: (i: number, offset: number, size: number, j: number) => {
        const i32Array = new Uint32Array(memory.buffer, offset, size);
        const i16Array = Uint16Array.from(i32Array);
        gl.bufferData(i, i16Array, j);
      },
      useProgram: (i: number) => {
        const { webglPrograms } = window.laze.props.webglObjects;

        gl.useProgram(webglPrograms[i]);
      },
      getAttribLocation: (i: number, offset: number, length: number) => {
        const { webglPrograms } = window.laze.props.webglObjects;

        let bytes = new Uint8Array(memory.buffer, offset, Number(length) * 4);
        // bytes.reverse();
        bytes = bytes.filter((element) => {
          return element !== 0;
        });
        const string = new TextDecoder('utf-8').decode(bytes);

        // string = [...string].reverse().join("");
        return gl.getAttribLocation(webglPrograms[i], string);
      },
      getUniformLocation: (i: number, offset: number, length: number) => {
        const { webglPrograms, webglUniformLoc } = window.laze.props.webglObjects;

        let bytes = new Uint8Array(memory.buffer, offset, Number(length) * 4);
        bytes = bytes.filter((element) => {
          return element !== 0;
        });
        const string = new TextDecoder('utf-8').decode(bytes);
        const location = gl.getUniformLocation(webglPrograms[i], string);
        if (location) {
          webglUniformLoc.push(location);
        } else {
          throw new Error('Failed to get the uniform location');
        }

        return webglUniformLoc.length - 1;
      },
      uniformMatrix2fv: (i: number, transpose: boolean, offset: number) => {
        const f64Array = new Float64Array(memory.buffer, offset, 4);
        const f32Array = Float32Array.from(f64Array);
        gl.uniformMatrix2fv(window.laze.props.webglObjects.webglUniformLoc[i], false, f32Array);
      },
      uniformMatrix3fv: (i: number, transpose: boolean, offset: number) => {
        const f64Array = new Float64Array(memory.buffer, offset, 9);
        const f32Array = Float32Array.from(f64Array);
        gl.uniformMatrix3fv(window.laze.props.webglObjects.webglUniformLoc[i], transpose, f32Array);
      },
      uniformMatrix4fv: (i: number, transpose: boolean, offset: number) => {
        const buffer = memory.buffer.slice(offset, 128 + offset);
        const f64Array = new Float64Array(buffer);
        const f32Array = Float32Array.from(f64Array);
        gl.uniformMatrix4fv(window.laze.props.webglObjects.webglUniformLoc[i], transpose, f32Array);
      },
      uniform1f: (i: number, v0: number) => {
        gl.uniform1f(window.laze.props.webglObjects.webglUniformLoc[i], v0);
      },
      uniform1fv: (i: number, v: Float32List) => {
        gl.uniform1fv(window.laze.props.webglObjects.webglUniformLoc[i], v);
      },
      uniform1i: (i: number, v0: number) => {
        gl.uniform1i(window.laze.props.webglObjects.webglUniformLoc[i], v0);
      },
      uniform1iv: (i: number, v: Float32List) => {
        gl.uniform1iv(window.laze.props.webglObjects.webglUniformLoc[i], v);
      },
      uniform2f: (i: number, v0: number, v1: number) => {
        gl.uniform2f(window.laze.props.webglObjects.webglUniformLoc[i], v0, v1);
      },
      uniform2fv: (i: number, v: Float32List) => {
        gl.uniform2fv(window.laze.props.webglObjects.webglUniformLoc[i], v);
      },
      uniform2i: (i: number, v0: number, v1: number) => {
        gl.uniform2i(window.laze.props.webglObjects.webglUniformLoc[i], v0, v1);
      },
      uniform2iv: (i: number, v: Float32List) => {
        gl.uniform2iv(window.laze.props.webglObjects.webglUniformLoc[i], v);
      },
      uniform3f: (i: number, v0: number, v1: number, v2: number) => {
        gl.uniform3f(window.laze.props.webglObjects.webglUniformLoc[i], v0, v1, v2);
      },
      uniform3fv: (i: number, v: Float32List) => {
        gl.uniform3fv(window.laze.props.webglObjects.webglUniformLoc[i], v);
      },
      uniform3i: (i: number, v0: number, v1: number, v2: number) => {
        gl.uniform3i(window.laze.props.webglObjects.webglUniformLoc[i], v0, v1, v2);
      },
      uniform3iv: (i: number, v: Float32List) => {
        gl.uniform3iv(window.laze.props.webglObjects.webglUniformLoc[i], v);
      },
      uniform4f: (i: number, v0: number, v1: number, v2: number, v3: number) => {
        gl.uniform4f(window.laze.props.webglObjects.webglUniformLoc[i], v0, v1, v2, v3);
      },
      uniform4fv: (i: number, v: Float32List) => {
        gl.uniform4fv(window.laze.props.webglObjects.webglUniformLoc[i], v);
      },
      uniform4i: (i: number, v0: number, v1: number, v2: number, v3: number) => {
        gl.uniform4i(window.laze.props.webglObjects.webglUniformLoc[i], v0, v1, v2, v3);
      },
      uniform4iv: (i: number, v: Float32List) => {
        gl.uniform4iv(window.laze.props.webglObjects.webglUniformLoc[i], v);
      },
      drawArrays: (i: number, first: number, count: number) => {
        gl.drawArrays(i, first, count);
      },
      drawElements: (i: number, count: number, type: number, offset: number) => {
        gl.drawElements(i, count, type, offset);
      },
      loadTexture: (offset: number, length: number) => {
        let bytes = new Uint8Array(memory.buffer, offset, Number(length) * 4);
        bytes = bytes.filter((element) => {
          return element !== 0;
        });
        const string = new TextDecoder('utf-8').decode(bytes);

        return loadTexture(gl, string);
      },
      activeTexture: (i: number) => {
        gl.activeTexture(i);
      },
      bindTexture: (i: number, j: number) => {
        gl.bindTexture(i, window.laze.props.webglObjects.webglTextures[j]);
      },
    },
    arduino: {
      setUp: async (vendorId: BigInt, index: number) => {
        const executeCallback = () => {
          if (window.laze.props.variables.lazeCallNoParam) {
            window.laze.props.variables.lazeCallNoParam(index);
          }
        };

        const { arduinoObjects } = window.laze.props;
        if (!arduinoObjects.port) {
          arduinoObjects.port = await window.navigator.serial.requestPort({
            filters: [{ usbVendorId: Number(vendorId) }],
          });
          await arduinoObjects.port.open({ baudRate: 9600 });
          executeCallback();
          const decoder = new TextDecoderStream();
          const inputStream = decoder.readable;
          arduinoObjects.serialReader = inputStream.getReader();
          await arduinoObjects.port.readable?.pipeTo(decoder.writable);
          await sleep(1000);
        } else {
          executeCallback();
        }
      },
      sendCommand: (command: number, data: number) => {
        const { arduinoObjects } = window.laze.props;
        if (arduinoObjects.port) {
          if (arduinoObjects.lastCommand.command !== command || arduinoObjects.lastCommand.data !== data) {
            const writer = arduinoObjects.port.writable?.getWriter();
            if (writer) {
              writer.write(new Uint8Array([command]));
              writer.write(new Uint8Array([data]));
              writer.releaseLock();
            } else {
              console.error('no writer');
            }
          }
          arduinoObjects.lastCommand.command = command;
          arduinoObjects.lastCommand.data = data;
        }
      },
      checkInput: async () => {
        const { arduinoObjects } = window.laze.props;
        if (arduinoObjects.serialReader) {
          const { value, done } = await arduinoObjects.serialReader.read();
          if (done == true && window.laze.props.variables.interval) {
            clearInterval(window.laze.props.variables.interval);
          }
          const val = value?.replaceAll('\r', '');
          if (val && !val.includes('\n')) {
            arduinoObjects.receiveText += val;
          } else if (val?.includes('\n')) {
            arduinoObjects.receiveText += val;
            const splitData = arduinoObjects.receiveText.split('\n');
            arduinoObjects.receiveText = splitData[0];

            if (arduinoObjects.receiveText.length) {
              const input = parseInt(arduinoObjects.receiveText.substring(2));
              switch (arduinoObjects.receiveText[0]) {
                case 'D':
                  arduinoObjects.digitalInput[parseInt(arduinoObjects.receiveText[1])] = input;
                  break;
                case 'A':
                  arduinoObjects.analogInput[parseInt(arduinoObjects.receiveText[1])] = input;
                  break;
              }
            }
            arduinoObjects.receiveText = splitData[1];
          }
        }
      },
      analogRead: (pinNumber: BigInt) => {
        return window.laze.props.arduinoObjects.analogInput[Number(pinNumber)];
      },
      digitalRead: (pinNumber: BigInt) => {
        return window.laze.props.arduinoObjects.digitalInput[Number(pinNumber)];
      },
    },
  };

  return (id: string): importObject => {
    const { addLog } = consoleSlice.actions;
    const logConsole = (content: string) => {
      dispatcher(
        addLog({
          console: id,
          content,
          level: 'log',
        })
      );
    };

    return {
      console: {
        log: (arg: number) => {
          logConsole(`${arg}`);
        },
        logstring: (offset: number, length: number) => {
          let bytes = new Uint8Array(memory.buffer, offset, Number(length) * 4);
          bytes = bytes.filter((element) => {
            return element !== 0;
          });
          const string = new TextDecoder('utf-8').decode(bytes);
          logConsole(string);
        },
        logMatrix: (offset: number) => {
          const buffer = memory.buffer.slice(offset, 128 + offset);
          const f64Array = new Float64Array(buffer);
          const f32Array = Float32Array.from(f64Array);
          logConsole(JSON.stringify(f32Array));
        },
      },
      ...imports,
    };
  };
};
