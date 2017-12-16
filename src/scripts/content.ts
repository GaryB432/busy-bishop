// tslint:disable:no-console

import * as domutils from './domutils';
import * as messages from './messages';
import { lastPointer } from './pointer';
import { Popup } from './popup';

const popup: Popup = new Popup();

popup.start(document.body, 'Suggested Edit');

import '../styles/base.scss';

function makeDiffDiv(
  start: string,
  strike: string,
  ins: string,
  end: string
): HTMLDivElement {
  const div = document.createElement('div');
  div.style.margin = '10px';
  div.appendChild(
    makeSpan({ backgroundColor: 'white' }, `...${start.trimLeft()}`)
  );
  div.appendChild(
    makeSpan({ backgroundColor: 'red', textDecoration: 'line-through' }, strike)
  );
  div.appendChild(makeSpan({ backgroundColor: 'green' }, ins));
  div.appendChild(
    makeSpan({ backgroundColor: 'white' }, `${end.trimRight()}...`)
  );
  return div;
}

async function processSuggestion(
  msg: messages.MakeSuggestionMessage
): Promise<boolean> {
  const subject = await domutils.getSubjectInfo(msg.elementPath, msg.original);
  const { element, textNode } = subject;
  const bishop = document.querySelector('#bishop');
  console.log(subject);
  if (element) {
    element.style.border = 'thin solid silver';
    if (textNode && textNode.textContent) {
      const text = textNode.textContent;
      const start = text.slice(0, msg.selectionStart);
      const strike = msg.original.slice(
        msg.selectionStart,
        msg.selectionStart + msg.selectionLength
      );
      const ins = msg.suggestedText;
      const end = text.slice(msg.selectionStart + msg.selectionLength);

      if (bishop) {
        const cntnr = document.createElement('div');
        cntnr.style.margin = '10px';
        cntnr.style.padding = '10px';
        cntnr.style.backgroundColor = '#cccccc';

        const ls = start.split('\n');

        cntnr.appendChild(makeDiffDiv(ls[ls.length - 1], strike, ins, end));
        bishop.appendChild(cntnr);
      }
    }
  }
  return Promise.resolve(true);
}

function makeSpan(
  style: Partial<CSSStyleDeclaration>,
  innerText: string
): HTMLSpanElement {
  const el = document.createElement('span');
  el.innerText = innerText;

  Object.assign(el.style, style);

  // el.style=style;
  // el.style.backgroundColor = backgroundColor;
  // el.style.textDecoration = 'line-through';
  return el;
}

async function startSuggestion(
  request: messages.StartSuggestionMessage
): Promise<messages.MakeSuggestionMessage> {
  return new Promise<messages.MakeSuggestionMessage>(
    async (resolve, _reject) => {
      const elem = document.elementFromPoint(lastPointer.x, lastPointer.y);

      const path = domutils.getElementPath(elem);

      const subject = await domutils.getSubjectInfo(
        path,
        request.selectionText
      );

      const original = !!subject.textNode
        ? subject.textNode.textContent!
        : subject.element!.textContent!;

      popup.doRun(request.selectionText).then(suggestedText => {
        const makeSuggestionMessage: messages.MakeSuggestionMessage = {
          elementPath: path,
          href: window.location.href,
          original,
          selectionLength: request.selectionText.length,
          selectionStart: original.indexOf(request.selectionText),
          suggestedText,
          textNodeIndex: subject.textNodeIndex,
          type: 'MAKE_SUGGESTION',
        };
        resolve(makeSuggestionMessage);
      });
    }
  );
}

chrome.runtime.onMessage.addListener(
  (request: messages.Message, _sender, sendResponse) => {
    switch (request.type) {
      case 'START_SUGGESTION':
        startSuggestion(request)
          .then(response => {
            processSuggestion(response);
            sendResponse(response);
          })
          .catch(e => console.log(e));
        break;
    }
    return true;
  }
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

const jcoglan: messages.MakeSuggestionMessage = {
  elementPath: [
    ['BODY', 1],
    ['DIV', 0],
    ['DIV', 1],
    ['DIV', 0],
    ['DIV', 0],
    ['ARTICLE', 0],
    ['DIV', 1],
    ['P', 3],
  ],
  href:
    'https://blog.jcoglan.com/2017/03/22/myers-diff-in-linear-space-theory/',
  original:
    ' and gone back to make progress on another project, I stumbled\ninto a case where Git produced a confusing diff for a file I’d just changed, and\nI had to know why. Here’s the portion of code I had been working on. It’s a\ncouple of C functions that copy bytes from one buffer to another, checking the\nsizes of the requested regions to make sure they’re within the buffer. (This is\nnot literally the code I was working on; I’ve removed a few things to make the\nexample smaller.)',
  selectionLength: 7,
  selectionStart: 174,
  suggestedText: 'part',
  textNodeIndex: 2,
  type: 'MAKE_SUGGESTION',
};

const testers: messages.MakeSuggestionMessage[] = [
  {
    elementPath: [
      ['BODY', 1],
      ['BFAM-ROOT', 0],
      ['MAIN', 1],
      ['BFAM-GARY', 1],
      ['BFAM-OVERVIEW', 1],
      ['DIV', 0],
      ['SECTION', 0],
      ['ARTICLE', 1],
      ['P', 2],
    ],
    href: 'https://bortosky.com/gary/overview',
    original: 'If you see me on the street ask me about ',
    selectionLength: 6,
    selectionStart: 21,
    suggestedText: 'boulevard',
    textNodeIndex: 0,
    type: 'MAKE_SUGGESTION',
  },
  {
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
    original:
      'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. I have used it\n\t\t\t\t',
    selectionLength: 5,
    selectionStart: 62,
    suggestedText: 'vanilla',
    textNodeIndex: 0,
    type: 'MAKE_SUGGESTION',
  },
];

testers.push(jcoglan);

window.setTimeout(() => {
  const aa = document.createElement('div');
  aa.id = 'bishop';
  document.body.appendChild(aa);
  for (const tester of testers) {
    if (tester.href === window.location.href) {
      processSuggestion(tester);
    }
  }
}, 500);
