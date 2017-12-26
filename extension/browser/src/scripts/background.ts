import { Logic } from './lib/logic/logic';
import { MessageSenderChrome } from './lib/logic/message-sender';
import { MakeSuggestionCommand, MakeSuggestionResponse } from './lib/logic/models';
const logic = new Logic(new MessageSenderChrome());

chrome.contextMenus.create({
  contexts: ['selection'],
  id: 'start',
  title: 'Suggest Edit',
});

function setup() {
  chrome.contextMenus.onClicked.addListener((info, _tab) => {
    console.log(info.menuItemId);
    if (info.selectionText) {
      logic.handleStartClick(info.selectionText);
    }
  });
  chrome.runtime.onMessage.addListener(
    (command: MakeSuggestionCommand, _sender, sendResponse) => {
      const response: MakeSuggestionResponse = {
        data: command.data,
        status: 'OK',
        type: 'MAKE_SUGGESTION_RESPONSE',
      };
      logic.handleMakeCommand(command);
      sendResponse(response);
    }
  );
}

setup();
console.log('Loaded.');
