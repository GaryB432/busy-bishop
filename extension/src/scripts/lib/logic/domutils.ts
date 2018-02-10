import { ParentAndIndex } from '../../../imported/models';
import { indicesOf } from '../utilities';

function getChildIndex(subject: Element): number {
  if (subject.parentElement) {
    const children = Array.from(subject.parentElement.children);
    const index: number = children.findIndex(child => child === subject);
    console.assert(children[index].tagName === subject.tagName, 'no match');
    return index;
  } else {
    return -1;
  }
}

function getElementsFromPoint(x: number, y: number): Element[] {
  const colors = [
    'red',
    'green',
    'blue',
    'purple',
    'brown',
    'orange',
    'yellow',
    'black',
  ];
  const elements: Element[] = document.elementsFromPoint(x, y);
  elements.forEach((el, i) => {
    const h = el as HTMLElement;
    h.style.border = `5px solid ${colors[i % colors.length]}`;
  });
  return elements;
}

function findTextContainers(element: Node, txt: string): number[] {
  const numberedNodes = Array.from(element.childNodes).map<{
    node: Node;
    index: number;
  }>((node, index) => {
    return { node, index };
  });
  return numberedNodes
    .filter(nn => {
      const node = nn.node;
      const indices =
        node.nodeName === '#text' && node.textContent
          ? indicesOf(node.textContent, txt, true)
          : [];
      if (indices.length > 1) {
        console.warn(node.textContent, indices);
      }
      return indices.length === 1;
    })
    .map(nn => nn.index);
}

function findElementContainers(
  x: number,
  y: number,
  txt: string
): { element: Element | null; indices: number[] } {
  for (const element of getElementsFromPoint(x, y)) {
    const indices = findTextContainers(element, txt);
    if (indices.length === 1) {
      return { element, indices };
    }
    // for (const node of Array.from(element.childNodes))
  }
  return { element: null, indices: [] };
}

export interface SuggestionSubjectInfo {
  element: HTMLElement | null;
  textNodeIndex: number;
  textNode: Node | null;
}

export function getElementPath(elem: Element): ParentAndIndex[] {
  const res: ParentAndIndex[] = [];
  let w = elem;
  while (w.parentElement) {
    res.push([w.tagName, getChildIndex(w)]);
    w = w.parentElement;
  }
  return res.reverse();
}

export function getSubjectInfo(
  x: number,
  y: number,
  text: string
): SuggestionSubjectInfo {
  let element: HTMLElement | null = null;
  let textNode: Node | null = null;
  let textNodeIndex = -1;
  const { element: el, indices } = findElementContainers(x, y, text);
  if (!!el && indices.length === 1) {
    element = el as HTMLElement;
    textNodeIndex = indices[0];
    textNode = element.childNodes[textNodeIndex];
  }
  return {
    element,
    textNode,
    textNodeIndex,
  };
}
