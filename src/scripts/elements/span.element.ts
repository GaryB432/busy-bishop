export function createSpanElement(
  style: Partial<CSSStyleDeclaration>,
  innerText: string
): HTMLElement {
  const span = document.createElement('span');
  span.innerText = innerText;
  Object.assign(span.style, style);
  return span;
}
