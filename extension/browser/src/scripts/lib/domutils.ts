import { ParentAndIndex } from '../../../../../common';

function getChildIndex(subject: Element): number {
  if (subject.parentElement) {
    const children = Array.from(subject.parentElement.children);
    const index: number = children.findIndex(child => child === subject);
    console.assert(children[index].tagName === subject.tagName, 'wtf');
    return index;
  } else {
    return -1;
  }
}

function getElementFromPath(path: ParentAndIndex[]): HTMLElement {
  let loopElement = document.body;
  path.forEach((p, i) => {
    const [parentTag, childIndex] = p;
    if (i > 0) {
      if (childIndex < loopElement.childElementCount) {
        const ce = loopElement.children[childIndex] as HTMLElement;
        console.assert(parentTag === ce.tagName);
        loopElement = ce;
      }
    }
  });
  return loopElement;
}

function findTextContainers(elem: Node, txt: string): number[] {
  const numberedNodes = Array.from(elem.childNodes).map<{
    node: Node;
    index: number;
  }>((node, index) => {
    return { node, index };
  });
  return numberedNodes
    .filter(nn => {
      const node = nn.node;
      return (
        node.nodeName === '#text' &&
        node.textContent &&
        node.textContent.indexOf(txt) > -1
      );
    })
    .map(nn => nn.index);
}

export interface SuggestionSubjectInfo {
  // elementPath: messages.ParentAndIndex[];
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
  element: HTMLElement,
  text: string
): SuggestionSubjectInfo {
  let textNode: Node | null = null;
  let textNodeIndex = -1;
  const tnc = findTextContainers(element, text);
  if (tnc.length === 1) {
    textNodeIndex = tnc[0];
    textNode = element.childNodes[textNodeIndex];
  }
  return {
    element,
    textNode,
    textNodeIndex,
  };
}
export async function getSubjectInfoOld(
  path: ParentAndIndex[],
  text: string
): Promise<SuggestionSubjectInfo> {
  return new Promise<SuggestionSubjectInfo>((resolve, _reject) => {
    resolve(getSubjectInfo(getElementFromPath(path), text));
  });
}
