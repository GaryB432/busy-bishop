import '../styles/content.scss';
import { Dialog } from './lib/dialog';
import {
  // FakePopup,
  Logic,
  MessageBusChrome,
  StartSuggestionCommand,
  StartSuggestionResponse,
  SuggestionDocument,
} from './lib/logic';
import { lastPointer } from './lib/pointer';

const dialog = new Dialog();
const logic = new Logic(new MessageBusChrome());
chrome.runtime.onMessage.addListener(
  async (command: StartSuggestionCommand, _sender, sendResponse) => {
    sendResponse({
      type: 'START_SUGGESTION_RESPONSE',
      command,
      status: 'WAITING',
    } as StartSuggestionResponse);
    const runDialog = async (doc: SuggestionDocument) => {
      const front = doc.context.slice(0, doc.selectionStart);
      const back = doc.context.slice(
        doc.selectedText.length + doc.selectionStart
      );
      return await dialog.doRun(front, doc.selectedText, back);
    };
    const suggestion = await logic.getSuggestionFromUser(
      lastPointer,
      command,
      runDialog
    );
    if (suggestion.textNodeIndex > -1) {
      logic.sendMakeSuggestion(suggestion);
    }
  }
);
dialog.start(document.body, 'Suggested Text');
