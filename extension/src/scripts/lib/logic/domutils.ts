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
  type Visibility = string | null;
  let element: HTMLElement;
  const elements: HTMLElement[] = [];
  const vizs: Visibility[] = [];
  while (
    (element = document.elementFromPoint(x, y) as HTMLElement) &&
    element !== document.documentElement
  ) {
    elements.push(element);
    vizs.push(element.style.visibility);
    element.style.visibility = 'hidden';
  }

  elements.forEach((elem, k) => {
    elem.style.visibility = vizs[k];
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
  } else {
    alert('Please select a small bit of text from a single element.');
  }
  return {
    element,
    textNode,
    textNodeIndex,
  };
}
