export const lastPointer: WebKitPoint = { x: 0, y: 0 };

document.addEventListener('pointermove', evt => {
  lastPointer.x = evt.x;
  lastPointer.y = evt.y;
});
