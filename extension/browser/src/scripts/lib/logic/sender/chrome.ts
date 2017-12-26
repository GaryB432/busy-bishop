import {
  MakeSuggestionCommand,
  MakeSuggestionResponse,
  StartSuggestionCommand,
  StartSuggestionResponse,
} from '../models';
import { MessageSender } from '../sender';

export class MessageSenderChrome extends MessageSender {
  public send(command: StartSuggestionCommand | MakeSuggestionCommand): void {
    console.log('sending', command);
    switch (command.type) {
      case 'MAKE_SUGGESTION':
        chrome.runtime.sendMessage(command, this.handleReponse);
        break;
      case 'START_SUGGESTION':
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          const tid = tabs[0].id!;
          chrome.tabs.sendMessage(tid, command, this.handleReponse);
        });
        break;
    }
  }
  private handleReponse(
    response: StartSuggestionResponse | MakeSuggestionResponse
  ) {
    console.log('ignoring ', response);
  }
}
