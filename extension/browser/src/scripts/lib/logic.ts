// import { MakeSuggestionMessage } from '../../../../../common/lib/index';

export type ParentAndIndex = [string, number];

export type SuggestionStatus = 'WAITING' | 'ERROR' | 'OK' | 'TEST';

export interface StartSuggestionMessage {}

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

// export class Handler {
//   public handleStartSuggestionCommand(
//     c: StartSuggestionCommand
//   ): StartSuggestionResponse {
//     console.log(c);
//     return { type: 'START_SUGGESTION_RESPONSE', command: c, status: 'WAITING' };
//   }

//   private writeToDb(c: SuggestionDocument): void {
//     console.log('writing', c);
//   }

//   public handleMakeSuggestionCommand(
//     c: MakeSuggestionCommand
//   ): MakeSuggestionResponse {
//     this.writeToDb(c.data);
//     return { type: 'MAKE_SUGGESTION_RESPONSE', data: c.data, status: 'OK' };
//   }

//   public handleMakeSuggestionResponse(r: MakeSuggestionResponse): void {
//     console.log(r);
//   }
// }

// =========================================

export class MessageBus {
  public send(command: StartSuggestionCommand | MakeSuggestionCommand) {
    console.log('send', command);
    // chrome.runtime.sendMessage(sm);
  }
}

export class Logic {
  constructor(private bus: MessageBus) {}
  private createDocument(suggestedText: string): SuggestionDocument {
    return {
      id: 'id',
      elementPath: [],
      context: 'context',
      textNodeIndex: -1,
      selectedText: 'dunno',
      selectionStart: -1,
      suggestedText,
      href: 'href',
      createdAt: 0,
    };
  }
  handleStartClick(_positionmaybe: any, selectionText: string): void {
    const command: StartSuggestionCommand = {
      type: 'START_SUGGESTION',
      selectionText,
      id: 'hi',
    };
    this.bus.send(command);
  }
  private createMakeCommand(
    _dom: HTMLDocument,
    _context: any,
    suggestedText: string
  ): MakeSuggestionCommand {
    const doc = this.createDocument(suggestedText);
    const cmd: MakeSuggestionCommand = {
      type: 'MAKE_SUGGESTION',
      data: doc,
    };
    return cmd;
  }
  public createAndSendMakeCommand(
    dom: HTMLDocument,
    context: any,
    suggestedText: string
  ): void {
    this.bus.send(this.createMakeCommand(dom, context, suggestedText));
  }
  handleMakeCommand(command: MakeSuggestionCommand): void {
    console.log('got one!', command.data);
    console.log('log one!', command.data);
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
      window.setTimeout(() => resolve(`changed ${selected}`), 2000);
    });
  }
}

// class Content {
//   private logic = new Logic(new MessageBus());
//   private popup = new FakePopup();

//   protected setup() {
//     chrome.runtime.onMessage.addListener(
//       async (m: StartSuggestionCommand, sender, sendResponse) => {
//         // this.logic.handleStartClick(m);
//         sendResponse(undefined);
//         console.log(m);
//         try {
//           const suggestedText = await this.popup.doRun('a', 'b', 'c');
//           this.logic.createAndSendMakeCommand(
//             document,
//             'context',
//             suggestedText
//           );
//         } finally {
//           return true;
//         }
//         // chrome.runtime.sendMessage(r);
//         // # Content
//         // 	gets start_command
//         // 	await suggestedTextAndContext(context and stuff)
//         // 		logic.createMakeCommand(element, context, suggestedText)
//         // 	chrome.send(makeCommand,sender,()=void);
//       }
//     );
//   }
// }

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
