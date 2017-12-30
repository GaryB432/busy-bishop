import { Logic } from './lib/logic/logic';
import {
  MakeSuggestionCommand,
  MakeSuggestionResponse,
} from './lib/logic/models';

const logic = new Logic();

chrome.contextMenus.create({
  contexts: ['selection'],
  id: 'start',
  title: 'Suggest Edit',
});
chrome.contextMenus.onClicked.addListener((info, _tab) => {
  if (info.selectionText) {
    logic.onStartSuggestion(info.selectionText);
  }
});
chrome.runtime.onMessage.addListener(
  (command: MakeSuggestionCommand, _sender, sendResponse) => {
    const response: MakeSuggestionResponse = {
      data: command.data,
      status: 'OK',
      type: 'MAKE_SUGGESTION_RESPONSE',
    };
    logic.omMakeSuggestion(command);
    sendResponse(response);
  }
);

console.log('Loaded.');
