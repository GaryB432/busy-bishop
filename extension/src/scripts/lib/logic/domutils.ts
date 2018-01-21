import { ParentAndIndex } from '../../../imported/models';
import { occurrences } from '../utilities';

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
        occurrences(node.textContent, txt, true) === 1
      );
    })
    .map(nn => nn.index);
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
  element: HTMLElement,
  text: string
): SuggestionSubjectInfo {
  let textNode: Node | null = null;
  let textNodeIndex = -1;
  const tnc = findTextContainers(element, text);
  if (tnc.length === 1) {
    textNodeIndex = tnc[0];
    textNode = element.childNodes[textNodeIndex];
  } else {
    console.log(element, text, tnc);
    alert('Please select a small bit of text from a single element.');
  }
  return {
    element,
    textNode,
    textNodeIndex,
  };
}
