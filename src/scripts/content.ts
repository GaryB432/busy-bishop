// tslint:disable:no-console

import * as domutils from './domutils';
import * as messages from './messages';
import { lastPointer } from './pointer';
import { Popup } from './popup';

const popup: Popup = new Popup();

popup.start(document.body, 'Suggested Edit');

import '../styles/base.scss';

function findSubjectElement(
  msg: messages.MakeSuggestionMessage
): HTMLElement | null {
  let elem: HTMLElement | null = null;
  if (msg.href === window.location.href) {
    elem = domutils.getSubjectElement(msg.elementPath);
    console.assert(elem.textContent === msg.original);
  }
  return elem;
}

function processSuggestion(msg: messages.MakeSuggestionMessage): void {
  const subject = findSubjectElement(msg);

  if (subject) {
    subject.style.border = 'thin solid silver';
  }
  console.log(subject);
}

function startSuggestion(
  request: messages.StartSuggestionMessage
): Promise<messages.MakeSuggestionMessage> {
  return new Promise<messages.MakeSuggestionMessage>(resolve => {
    const elem = document.elementFromPoint(lastPointer.x, lastPointer.y);
    const original = elem.textContent;
    if (original) {
      popup.doRun(request.selectionText).then(suggestedText => {
        const selectionStart = original.indexOf(request.selectionText);
        const elementPath: messages.ParentAndIndex[] = domutils.getElementPath(
          elem
        );
        const makeSuggestionMessage: messages.MakeSuggestionMessage = {
          elementPath,
          href: window.location.href,
          original,
          selectionLength: request.selectionText.length,
          selectionStart,
          suggestedText,
          type: 'MAKE_SUGGESTION',
        };
        resolve(makeSuggestionMessage);
      });
    }
  });
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

// function printSuggestionMessage(msg: MakeSuggestionMessage) {
//   const element = findSubjectElement(msg);
//   console.log(element);
//   const parts = [
//     msg.original.slice(0, msg.selectionStart),
//     msg.suggestedText,
//     msg.original.slice(msg.selectionStart + msg.selectionLength),
//   ];
//   console.log(msg);
//   console.log(parts.join('<<->>'));
// }

// const tester: MakeSuggestionMessage = {
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
//   suggestedText: 'top',
//   type: 'MAKE_SUGGESTION',
// };

// // const tester: MakeSuggestionMessage = {
// //   elementPath: [
// //     ['BODY', 1],
// //     ['DIV', 0],
// //     ['DIV', 1],
// //     ['DIV', 0],
// //     ['DIV', 0],
// //     ['ARTICLE', 0],
// //     ['DIV', 1],
// //     ['P', 3],
// //   ],
// //   href:
// //     'https://blog.jcoglan.com/2017/03/22/myers-diff-in-linear-space-theory/',
// //   original:
// //     'As luck would have it, as soon as I had finished up my previous articles on\nMyers diffs and gone back to make progress on another project, I stumbled\ninto a case where Git produced a confusing diff for a file I’d just changed, and\nI had to know why. Here’s the portion of code I had been working on. It’s a\ncouple of C functions that copy bytes from one buffer to another, checking the\nsizes of the requested regions to make sure they’re within the buffer. (This is\nnot literally the code I was working on; I’ve removed a few things to make the\nexample smaller.)',
// //   selectionLength: 6,
// //   selectionStart: 354,
// //   suggestedText: 'memory area',
// //   type: 'MAKE_SUGGESTION',
// // };

// const r = findSubjectElement(tester);
// if (r) {
//   console.log(r.tagName);
//   console.log(r.textContent);
// }
// console.log(tester.original);
