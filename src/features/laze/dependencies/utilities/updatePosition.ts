import type { keyControlType } from '@/typings/compiler';

import type { importGraphicsProps } from '../graphics';

export const updatePosition = (keyControl: keyControlType, e: MouseEvent, canvas: HTMLCanvasElement): void => {
  keyControl.relativeMouseX =
    (e.clientX - canvas.getBoundingClientRect().left - canvas.clientWidth / 2) / (canvas.clientWidth / 2);
  keyControl.relativeMouseY = -(
    (e.clientY - canvas.getBoundingClientRect().top - canvas.clientHeight / 2) /
    (canvas.clientHeight / 2)
  );
  // keyControl.absoluteMouseX += e.movementX;
  // keyControl.absoluteMouseY += e.movementY;
};
export const updateAbsolutePosition = (props: importGraphicsProps) => {
  return (e: MouseEvent): void => {
    props.keyControl.absoluteMouseX += e.movementX;
    props.keyControl.absoluteMouseY += e.movementY;
  };
};
export const updateScroll = (keyControl: keyControlType) => {
  return (e: WheelEvent): void => {
    e.preventDefault();
    keyControl.scrollY = e.deltaY;
  };
};
