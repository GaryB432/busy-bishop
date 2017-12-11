// tslint:disable:no-console

import * as domutils from './domutils';
import * as messages from './messages';
import { lastPointer } from './pointer';
import { Popup } from './popup';

const popup: Popup = new Popup();

popup.start(document.body, 'Suggested Edit');

import '../styles/base.scss';

async function processSuggestion(
  msg: messages.MakeSuggestionMessage
): Promise<boolean> {
  const subject = await domutils.getSubjectInfo(msg.elementPath, msg.original);
  const { element, textNode } = subject;
  console.log(subject);
  if (element) {
    element.style.border = 'thin solid silver';
    if (textNode) {
      textNode.textContent = 'ok now';
    }
  }
  return Promise.resolve(true);
}

async function startSuggestion(
  request: messages.StartSuggestionMessage
): Promise<messages.MakeSuggestionMessage> {
  return new Promise<messages.MakeSuggestionMessage>(
    async (resolve, _reject) => {
      const elem = document.elementFromPoint(lastPointer.x, lastPointer.y);

      const subject = await domutils.getSubjectInfo(
        domutils.getElementPath(elem),
        request.selectionText
      );

      const original = !!subject.textNode
        ? subject.textNode.textContent!
        : subject.element!.textContent!;

      popup.doRun(request.selectionText).then(suggestedText => {
        const makeSuggestionMessage: messages.MakeSuggestionMessage = {
          elementPath: subject.elementPath,
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

const tester: messages.MakeSuggestionMessage = {
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

processSuggestion(tester);
