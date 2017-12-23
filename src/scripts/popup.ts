import '../styles/popup.scss';
import * as data from './lib/data';
import * as utilities from './lib/utilities';

const elem = document.querySelector('#suggestions');

const ltrim = (str: string) => str.replace(/^\s+/, '');
const rtrim = (str: string) => str.replace(/\s+$/, '');

export function createDiffElement(
  start: string,
  strike: string,
  ins: string,
  end: string
): DocumentFragment {
  const template = document.querySelector(
    '#diffTemplate'
  ) as HTMLTemplateElement;
  if (!template) {
    throw new Error('sorry');
  }
  const div = document.importNode(template.content, true);
  const spans: NodeListOf<HTMLSpanElement> = div.querySelectorAll(
    'div.diff > span'
  );
  spans[0].innerHTML = `&hellip;${ltrim(start)}`;
  spans[1].innerHTML = strike;
  spans[2].innerHTML = ins;
  spans[3].innerHTML = `${rtrim(end)}&hellip;`;
  return div;
}

async function processUrl(url?: string): Promise<boolean> {
  const sugs = document.createElement('div');
  if (!!url) {
    const testers = await data.getForHref(url);
    for (const tester of testers) {
      const flx = utilities.narrowSelectionContext(
        tester.context,
        tester.selectedText
      );
      console.log(flx, tester.context, tester.selectedText);

      if (!!flx) {
        const { line, index } = flx;
        const selectionLength = tester.selectedText.length;
        const start = line.slice(0, index);
        const strike = line.slice(index, index + selectionLength);
        const ins = tester.suggestedText!;
        const end = line.slice(index + selectionLength);
        sugs.appendChild(createDiffElement(start, strike, ins, end));
      }
    }
  }
  elem!.appendChild(sugs);
  return true;
}

chrome.tabs.query(
  { active: true, currentWindow: true },
  (tabs: chrome.tabs.Tab[]) => processUrl(tabs[0].url)
);
