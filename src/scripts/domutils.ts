import { ParentAndIndex } from './messages';

function getChildIndex(subject: Element): number {
  if (subject.parentElement) {
    return Array.from(subject.parentElement.children).findIndex(
      child => child === subject
    );
  } else {
    return -1;
  }
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
