export const updatePosition = (e: MouseEvent, canvas: HTMLCanvasElement): void => {
  window.laze.props.variables.keyControl.relativeMouseX =
    (e.clientX - canvas.getBoundingClientRect().left - canvas.clientWidth / 2) / (canvas.clientWidth / 2);
  window.laze.props.variables.keyControl.relativeMouseY = -(
    (e.clientY - canvas.getBoundingClientRect().top - canvas.clientHeight / 2) /
    (canvas.clientHeight / 2)
  );
  window.laze.props.variables.keyControl.absoluteMouseX += e.movementX;
  window.laze.props.variables.keyControl.absoluteMouseY += e.movementY;
};
export const updateScroll = (e: WheelEvent): void => {
  e.preventDefault();
  window.laze.props.variables.keyControl.scrollY = e.deltaY;
};
