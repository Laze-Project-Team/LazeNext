import type { keyControlType } from '@/typings/compiler';

export const keyControlInitialize = (keyControl: keyControlType): void => {
  let lastDownTarget: EventTarget | null;

  const canvas = <HTMLCanvasElement>document.getElementById('output-canvas');
  document.addEventListener(
    'mousedown',
    (e) => {
      keyControl.mousePressed = true;
      lastDownTarget = e.target;
    },
    false
  );
  document.addEventListener(
    'mouseup',
    (e) => {
      if (e.target === canvas) {
        keyControl.mousePressed = false;
      }
    },
    false
  );
  document.addEventListener(
    'keydown',
    (e) => {
      if (lastDownTarget === canvas) {
        keyControl.pressedKeys[e.keyCode] = true;
      }
    },
    false
  );
  document.addEventListener(
    'keyup',
    (e) => {
      if (lastDownTarget === canvas) {
        keyControl.pressedKeys[e.keyCode] = false;
      }
    },
    false
  );
};

export const initialKeyControl = {
  relativeMouseX: 0.0,
  relativeMouseY: 0.0,
  absoluteMouseX: 0.0,
  absoluteMouseY: 0.0,
  mousePressed: false,
  pressedKeys: new Array(256).fill(false),
  scrollY: 0,
};
