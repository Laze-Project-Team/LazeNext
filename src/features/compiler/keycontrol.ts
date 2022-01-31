export const keyControlInitialize = (): void => {
  let lastDownTarget: EventTarget | null;

  const canvas = <HTMLCanvasElement>document.getElementById('output-canvas');
  document.addEventListener(
    'mousedown',
    (e) => {
      window.laze.props.variables.keyControl.mousePressed = true;
      lastDownTarget = e.target;
    },
    false
  );
  document.addEventListener(
    'mouseup',
    (e) => {
      if (e.target === canvas) {
        window.laze.props.variables.keyControl.mousePressed = false;
      }
    },
    false
  );
  document.addEventListener(
    'keydown',
    (e) => {
      if (lastDownTarget === canvas) {
        window.laze.props.variables.keyControl.pressedKeys[e.keyCode] = true;
      }
    },
    false
  );
  document.addEventListener(
    'keyup',
    (e) => {
      if (lastDownTarget === canvas) {
        window.laze.props.variables.keyControl.pressedKeys[e.keyCode] = false;
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
};
