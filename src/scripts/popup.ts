import '../styles/popup.scss';
import * as messages from './lib/messages';
import * as utilities from './lib/utilities';

const elem = document.querySelector('#suggestions');

elem!.innerHTML = '<h1>Hello Extension</h1>';

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
  const spans = div.querySelectorAll('span');
  spans[0].innerText = `...${ltrim(start)}`;
  spans[1].innerText = strike;
  spans[2].innerText = ins;
  spans[3].innerText = `${rtrim(end)}...`;
  return div;
}

function processUrl(url?: string): boolean {
  const sugs = document.createElement('div');
  if (!!url) {
    for (const tester of testers) {
      if (tester.href === url) {
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
  }
  elem!.appendChild(sugs);
  return true;
}

chrome.tabs.query(
  { active: true, currentWindow: true },
  (tabs: chrome.tabs.Tab[]) => processUrl(tabs[0].url)
);

const testers: messages.MakeSuggestionMessage[] = [
  {
    context:
      'The interesting thing about diff algorithms is that they’re a mix of computer\nscience and human factors. There are many equally good diffs between two files,\njudging them by the length of the edit sequence, and choosing between them\nrequires an algorithm that can best match people’s intuition about how their\ncode has changed.',
    elementPath: [
      ['BODY', 1],
      ['DIV', 0],
      ['DIV', 1],
      ['DIV', 0],
      ['DIV', 0],
      ['ARTICLE', 0],
      ['DIV', 1],
      ['P', 2],
    ],
    href:
      'https://blog.jcoglan.com/2017/03/22/myers-diff-in-linear-space-theory/',
    selectedText: 'intuition',
    selectionStart: 284,
    status: 'TEST',
    suggestedText: 'gut feel',
    textNodeIndex: 0,
    type: 'MAKE_SUGGESTION',
  },
  {
    context:
      'And indeed, if you try running these two code snippets through our previous\nMyers implementation, this is exactly what you get. However, when you ask Git to\ncompare these versions, here’s what happens:',
    elementPath: [
      ['BODY', 1],
      ['DIV', 0],
      ['DIV', 1],
      ['DIV', 0],
      ['DIV', 0],
      ['ARTICLE', 0],
      ['DIV', 1],
      ['P', 9],
    ],
    href:
      'https://blog.jcoglan.com/2017/03/22/myers-diff-in-linear-space-theory/',
    selectedText: 'exactly',
    selectionStart: 106,
    status: 'TEST',
    suggestedText: 'precisely',
    textNodeIndex: 0,
    type: 'MAKE_SUGGESTION',
  },
  {
    context: 'poor quality',
    elementPath: [
      ['BODY', 1],
      ['DIV', 0],
      ['DIV', 1],
      ['DIV', 0],
      ['DIV', 0],
      ['ARTICLE', 0],
      ['DIV', 1],
      ['P', 11],
      ['EM', 1],
    ],
    href:
      'https://blog.jcoglan.com/2017/03/22/myers-diff-in-linear-space-theory/',
    selectedText: 'poor quality',
    selectionStart: 0,
    status: 'TEST',
    suggestedText: 'shitty',
    textNodeIndex: 0,
    type: 'MAKE_SUGGESTION',
  },
  {
    context: 'by James Coglan',
    elementPath: [
      ['BODY', 1],
      ['DIV', 0],
      ['HEADER', 0],
      ['HGROUP', 1],
      ['H2', 1],
    ],
    href:
      'https://blog.jcoglan.com/2017/03/22/myers-diff-in-linear-space-theory/',
    selectedText: 'Coglan',
    selectionStart: 9,
    status: 'TEST',
    suggestedText: 'Cooglan',
    textNodeIndex: 0,
    type: 'MAKE_SUGGESTION',
  },
  {
    context:
      'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. I have used it\n\t\t\t\t',
    elementPath: [
      ['BODY', 1],
      ['BFAM-ROOT', 0],
      ['MAIN', 1],
      ['BFAM-GARY', 1],
      ['BFAM-OVERVIEW', 1],
      ['DIV', 0],
      ['SECTION', 0],
      ['ARTICLE', 1],
      ['P', 1],
    ],
    href: 'https://bortosky.com/gary/overview',
    selectedText: 'compiles',
    selectionStart: 50,
    status: 'TEST',
    suggestedText: 'changed compiles',
    textNodeIndex: 0,
    type: 'MAKE_SUGGESTION',
  },
  {
    context: 'Areas of Interest',
    elementPath: [
      ['BODY', 1],
      ['BFAM-ROOT', 0],
      ['MAIN', 1],
      ['BFAM-GARY', 1],
      ['BFAM-OVERVIEW', 1],
      ['DIV', 0],
      ['SECTION', 0],
      ['H1', 0],
    ],
    href: 'https://bortosky.com/gary/overview',
    selectedText: 'Interest',
    selectionStart: 9,
    status: 'TEST',
    suggestedText: 'changed Interest',
    textNodeIndex: 0,
    type: 'MAKE_SUGGESTION',
  },
  {
    context:
      'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. I have used it\n\t\t\t\t',
    elementPath: [
      ['BODY', 1],
      ['BFAM-ROOT', 0],
      ['MAIN', 1],
      ['BFAM-GARY', 1],
      ['BFAM-OVERVIEW', 1],
      ['DIV', 0],
      ['SECTION', 0],
      ['ARTICLE', 1],
      ['P', 1],
    ],
    href: 'https://bortosky.com/gary/overview',
    selectedText: 'used',
    selectionStart: 87,
    status: 'TEST',
    suggestedText: 'changed used',
    textNodeIndex: 0,
    type: 'MAKE_SUGGESTION',
  },
  {
    context:
      "The Web's scaffolding tool for modern webapps. I have dabbled with creating my own generators and have contributed to existing ones.",
    elementPath: [
      ['BODY', 1],
      ['BFAM-ROOT', 0],
      ['MAIN', 1],
      ['BFAM-GARY', 1],
      ['BFAM-OVERVIEW', 1],
      ['DIV', 0],
      ['SECTION', 0],
      ['ARTICLE', 5],
      ['P', 1],
    ],
    href: 'https://bortosky.com/gary/overview',
    selectedText: 'webapps',
    selectionStart: 38,
    status: 'TEST',
    suggestedText: 'changed webapps',
    textNodeIndex: 0,
    type: 'MAKE_SUGGESTION',
  },
  {
    context:
      "The Web's scaffolding tool for modern webapps. I have dabbled with creating my own generators and have contributed to existing ones.",
    elementPath: [
      ['BODY', 1],
      ['BFAM-ROOT', 0],
      ['MAIN', 1],
      ['BFAM-GARY', 1],
      ['BFAM-OVERVIEW', 1],
      ['DIV', 0],
      ['SECTION', 0],
      ['ARTICLE', 5],
      ['P', 1],
    ],
    href: 'https://bortosky.com/gary/overview',
    selectedText: 'scaffolding',
    selectionStart: 10,
    status: 'TEST',
    suggestedText: 'changed scaffolding',
    textNodeIndex: 0,
    type: 'MAKE_SUGGESTION',
  },
];
