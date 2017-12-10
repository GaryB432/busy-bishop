import { ParentAndIndex } from './messages';

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

export function getElementPath(elem: Element): ParentAndIndex[] {
  const res: ParentAndIndex[] = [];
  let w = elem;
  while (w.parentElement) {
    res.push([w.tagName, getChildIndex(w)]);
    w = w.parentElement;
  }
  return res.reverse();
}

export function getSubjectElement(path: ParentAndIndex[]): HTMLElement {
  let workingElement = document.body;

  path.forEach((p, i, wp) => {
    const [parentTag, childIndex] = p;

    if (i > 0) {
      const [la, lb] = wp[i - 1];
      // console.assert(childIndex < workingElement.childElementCount);

      if (childIndex < workingElement.childElementCount) {
        const ce = workingElement.children[childIndex] as HTMLElement;
        if (!workingElement || workingElement.tagName === la) {
          console.log('---', parentTag, la, lb, ce.tagName);
        }
        workingElement = ce;
      }
    }
    // console.log(a, b, i);
  });

  return workingElement;
}
