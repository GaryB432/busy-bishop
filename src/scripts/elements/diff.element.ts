import { createSpanElement } from '.';

export function createDiffElement(
  start: string,
  strike: string,
  ins: string,
  end: string
): HTMLDivElement {
  const d = document.createElement('div');
  d.style.margin = '10px';
  d.appendChild(
    createSpanElement({ backgroundColor: 'white' }, `...${start.trimLeft()}`)
  );
  d.appendChild(
    createSpanElement(
      { backgroundColor: 'red', textDecoration: 'line-through' },
      strike
    )
  );
  d.appendChild(createSpanElement({ backgroundColor: 'green' }, ins));
  d.appendChild(
    createSpanElement({ backgroundColor: 'white' }, `${end.trimRight()}...`)
  );
  return d;
}
