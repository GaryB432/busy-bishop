import {
  Logic,
  MakeSuggestionCommand,
  MessageBusChrome,
  MakeSuggestionResponse,
} from './lib/logic';
const logic = new Logic(new MessageBusChrome());

chrome.contextMenus.create({
  contexts: ['selection'],
  id: 'start',
  title: 'Suggest Edit',
});

function setup() {
  chrome.contextMenus.onClicked.addListener((info, _tab) => {
    console.log(info.menuItemId);
    if (info.selectionText) {
      logic.handleStartClick('xy,element', info.selectionText);
    }
  });
  chrome.runtime.onMessage.addListener(
    (command: MakeSuggestionCommand, _sender, sendResponse) => {
      const response: MakeSuggestionResponse = {
        data: command.data,
        type: 'MAKE_SUGGESTION_RESPONSE',
        status: 'OK',
      };
      logic.handleMakeCommand(command);
      sendResponse(response);
    }
  );
}

setup();
console.log('Loaded.');
