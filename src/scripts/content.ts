// tslint:disable:no-console

import { Message } from './messages';

import '../styles/base.scss';

chrome.runtime.onMessage.addListener(
  (request: Message, sender, sendResponse) => {
    console.log(
      sender.tab
        ? 'from a content script:' + sender.tab.url
        : 'from the extension'
    );
    if (request.type === 'START_SUGGESTION') {
      sendResponse({ farewell: 'goodbye' });
    }
  }
);

// import { getElementPath, getSubjectElement } from './domutils';
// import { MakeSuggestionMessage, Message, ParentAndIndex } from './messages';
// import { Popup } from './popup';

// const popup: Popup = new Popup();

// const lastPointer: WebKitPoint = { x: 0, y: 0 };

// popup.start(document.body, 'Suggested Edit');

// function sendMessage(
//   message: Message,
//   responseCallback?: (response: any) => void
// ): void {
//   chrome.runtime.sendMessage(message, responseCallback);
// }

// function findSubjectElement(msg: MakeSuggestionMessage): Element | null {
//   let elem: Element | null = null;
//   if (msg.href === window.location.href) {
//     elem = getSubjectElement(msg.elementPath);
//     console.assert(elem.textContent === msg.original);
//   }
//   return elem;
// }

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

// function messageHandler(
//   msg: Message,
//   _sender: chrome.runtime.MessageSender,
//   sendResponse: (response: any) => void
// ) {
//   if (msg.type === 'START_SUGGESTION') {
//     const elem = document.elementFromPoint(lastPointer.x, lastPointer.y);
//     const original = elem.textContent;
//     if (original) {
//       popup.run(msg.selectionText, suggestedText => {
//         const selectionStart = original.indexOf(msg.selectionText);
//         const elementPath: ParentAndIndex[] = getElementPath(elem);
//         const makeSuggestionMessage: MakeSuggestionMessage = {
//           elementPath,
//           href: window.location.href,
//           original,
//           selectionLength: msg.selectionText.length,
//           selectionStart,
//           suggestedText,
//           type: 'MAKE_SUGGESTION',
//         };
//         sendMessage(makeSuggestionMessage, sendResponse);
//         printSuggestionMessage(makeSuggestionMessage);
//       });
//     }
//   }
// }

// document.addEventListener('pointermove', evt => {
//   lastPointer.x = evt.x;
//   lastPointer.y = evt.y;
// });

// chrome.runtime.onMessage.addListener(messageHandler);

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
