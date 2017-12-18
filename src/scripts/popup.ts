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
          const ins = tester.suggestedText;
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

// const tester: messages.MakeSuggestionMessage = {
//   elementPath: [
//     ['BODY', 1],
//     ['BFAM-ROOT', 0],
//     ['MAIN', 1],
//     ['BFAM-HOME', 1],
//     ['P', 1],
//   ],
//   href: 'https://bortosky.com/',
//   original: 'Use the links at the top to explore.',
//   selectionLength: 3,
//   selectionStart: 21,
//   suggestedText: 'bottom',
//   textNodeIndex: 0,
//   type: 'MAKE_SUGGESTION',
// };

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
    suggestedText: 'Cooglan',
    textNodeIndex: 0,
    type: 'MAKE_SUGGESTION',
  },
];
