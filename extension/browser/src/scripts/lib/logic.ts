const uuidv4 = require('uuid');

export type ParentAndIndex = [string, number];

export interface SuggestionDocument {
  id: string;
  elementPath: ParentAndIndex[];
  context: string;
  textNodeIndex: number;
  selectedText: string;
  selectionStart: number;
  suggestedText?: string;
  href: string;
  createdAt: number;
}
export interface StartSuggestionCommand {
  type: 'START_SUGGESTION';
  id: string;
  selectionText: string;
}
export interface StartSuggestionResponse {
  type: 'START_SUGGESTION_RESPONSE';
  command: StartSuggestionCommand;
  status: 'OK' | 'ERROR' | 'WAITING';
}
export interface MakeSuggestionCommand {
  type: 'MAKE_SUGGESTION';
  data: SuggestionDocument;
}
export interface MakeSuggestionResponse {
  type: 'MAKE_SUGGESTION_RESPONSE';
  data: SuggestionDocument;
  status: 'OK' | 'ERROR';
}

export abstract class MessageBus {
  public abstract send(
    command: StartSuggestionCommand | MakeSuggestionCommand
  ): void;
}

export class MessageBusChrome extends MessageBus {
  public send(command: StartSuggestionCommand | MakeSuggestionCommand): void {
    console.log('sending', command);
    switch (command.type) {
      case 'MAKE_SUGGESTION':
        chrome.runtime.sendMessage(command, this.handleReponse);
        break;
      case 'START_SUGGESTION':
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          const tid = tabs[0].id!;
          console.log(tid);
          chrome.tabs.sendMessage(tid, command, this.handleReponse);
        });
        break;
    }
  }
  private handleReponse(response: StartSuggestionResponse) {
    console.log('ignoring ', response);
  }
}

export class Logic {
  constructor(private bus: MessageBus) {}
  public handleStartClick(_positionmaybe: any, selectionText: string): void {
    const command: StartSuggestionCommand = {
      id: uuidv4(),
      selectionText,
      type: 'START_SUGGESTION',
    };
    this.bus.send(command);
  }
  public createAndSendMakeCommand(
    dom: HTMLDocument,
    command: StartSuggestionCommand,
    context: any,
    suggestedText: string
  ): void {
    this.bus.send(this.createMakeCommand(dom, command, context, suggestedText));
  }
  public handleMakeCommand(command: MakeSuggestionCommand): void {
    console.log('got one!', command.data);
    console.log('log one!', command.data);
  }
  private createDocument(
    ssc: StartSuggestionCommand,
    suggestedText: string
  ): SuggestionDocument {
    return {
      context: 'context',
      createdAt: 0,
      elementPath: [],
      href: 'href',
      id: ssc.id,
      selectedText: 'dunno',
      selectionStart: -1,
      suggestedText,
      textNodeIndex: -1,
    };
  }
  private createMakeCommand(
    _dom: HTMLDocument,
    _command: StartSuggestionCommand,
    _context: any,
    suggestedText: string
  ): MakeSuggestionCommand {
    const doc = this.createDocument(_command, suggestedText);
    const cmd: MakeSuggestionCommand = {
      data: doc,
      type: 'MAKE_SUGGESTION',
    };
    return cmd;
  }
}

// class Background {
//   private logic = new Logic(new MessageBus());
//   protected setup() {
//     chrome.contextMenus.onClicked.addListener((info, _tab) => {
//       if (info.selectionText) {
//         const x = this.logic.handleStartClick('xy,element', info.selectionText);
//         // const r = this.logic.createMakeCommand('dom', info.selectionText)
//       }
//     });
//     chrome.runtime.onMessage.addListener(
//       (m: MakeSuggestionCommand, _sender, sendResponse) => {
//         // this.logic.handleStartClick(m);
//         console.log(m);
//         sendResponse(undefined);
//       }
//     );
//   }
// }

export class FakePopup {
  public async doRun(
    _front: string,
    selected: string,
    _back: string
  ): Promise<string> {
    return new Promise<string>(resolve => {
      window.setTimeout(() => resolve(`changed ${selected}!`), 5000);
    });
  }
}

// # Logic
// 	handleStartClick(positionmaybe?, selectionText)
// 		createStartCommand(position,selectionText):StartCommand
// 		chrome.send(startCommand,sender,()=void);
// 	createMakeCommand w/dom/dialog/async etc
// 		createDocument(dom, dialog, suggestedText)
// 	handleMakeCommand(makeCommand)
// 		writeToDb(makeCommand.document)
// 		doOtherLogging(makeCommand.etc)

// # Background
// 	gets startClick
// 		logic.handleStartClick(positionmaybe?, selectionText)
// 	gets makeCommand
// 		logic.handleMakeCommand(makeCommand)

// # Content
// 	gets start_command
// 	await suggestedTextAndContext(context and stuff)
// 		logic.createMakeCommand(element, context, suggestedText)
// 	chrome.send(makeCommand,sender,()=void);

// # User
// 	sends startClick
// 	sends suggestedTextAndContext

// ====old content===
// import {
//   MakeSuggestionMessage,
//   Message,
//   StartSuggestionMessage,
// } from '../../../../common';
// import { Dialog } from './lib/dialog';
// import * as domutils from './lib/domutils';
// import { lastPointer } from './lib/pointer';

// const dialog: Dialog = new Dialog();

// dialog.start(document.body, 'Suggested Edit');

// function startSuggestion(
//   request: StartSuggestionMessage
// ): Promise<MakeSuggestionMessage> {
//   const elem = document.elementFromPoint(lastPointer.x, lastPointer.y);

//   return new Promise<MakeSuggestionMessage>(async resolve => {
//     const msm: Partial<MakeSuggestionMessage> = {
//       createdAt: new Date().getTime(),
//       elementPath: domutils.getElementPath(elem),
//       href: window.location.href,
//       id: request.id,
//       selectedText: request.selectionText,
//       status: 'WAITING',
//       textNodeIndex: -1,
//       type: 'MAKE_SUGGESTION',
//     };

//     const subject = await domutils.getSubjectInfo(
//       msm.elementPath!,
//       request.selectionText
//     );

//     msm.status = 'ERROR';
//     if (subject.textNode) {
//       msm.context = subject.textNode.textContent!;
//       msm.selectionStart = msm.context.indexOf(request.selectionText);
//       console.log(`about to run ${request.selectionText}`);
//       msm.suggestedText = await dialog.doRun(
//         msm.context.slice(0, msm.selectionStart),
//         request.selectionText,
//         msm.context.slice(msm.selectionStart + request.selectionText.length)
//       );
//       if (msm.suggestedText) {
//         msm.status = 'OK';
//         msm.textNodeIndex = subject.textNodeIndex;
//         console.log(`resolved ${request.selectionText}`);
//       }
//     } else {
//       alert('Select just a small piece of text within a single element');
//     }

//     resolve(msm as MakeSuggestionMessage);
//   });
// }

// chrome.runtime.onMessage.addListener(
//   (request: Message, _sender, sendResponse) => {
//     switch (request.type) {
//       case 'START_SUGGESTION':
//         startSuggestion(request).then(sendResponse);
//         break;
//     }
//     return true;
//   }
// );

// ============old bg==============
// tslint:disable:no-console no-var-requires

// import { MakeSuggestionMessage } from '../../../../common';
// import * as xhr from './lib/xhr';

// function handleSuggestionResponse(suggestion: MakeSuggestionMessage): void {
//   console.log(JSON.stringify(suggestion, null, 2));
//   switch (suggestion.status) {
//     case 'OK':
//       xhr.getJSON<any>('https://bortosky.com/theater.json').then(a => {
//         console.log(a);
//       });
//       xhr
//         .send<MakeSuggestionMessage, void>('http://example.com', suggestion)
//         .then(
//           data => {
//             console.log('Yep: ' + data);
//           },
//           _status => {
//             console.error('Something went wrong.');
//           }
//         );
//       break;
//     case 'ERROR':
//       console.log('not doing much');
//       break;
//     default:
//       throw new Error('zomg');
//   }
// }

// chrome.contextMenus.onClicked.addListener(
//   (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab | undefined) => {
//     if (tab && tab.id && info.selectionText) {
//       chrome.tabs.sendMessage(
//         tab.id,
//         {
//           id: uuidv4(),
//           selectionText: info.selectionText,
//           type: 'START_SUGGESTION',
//         },
//         response => {
//           if (response) {
//             handleSuggestionResponse(response);
//           } else {
//             console.log(chrome.runtime.lastError, 'oops');
//           }
//         }
//       );
//     }
//   }
// );
