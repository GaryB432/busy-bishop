import { AppInsights } from 'applicationinsights-js';
import { SuggestionDocument } from '../imported/models';
import { Dialog } from './lib/dialog';
import { Logic } from './lib/logic/logic';
import {
  StartSuggestionCommand,
  StartSuggestionResponse,
} from './lib/logic/models';
import { lastPointer } from './lib/pointer';

const dialog = new Dialog();
const logic = new Logic();

if (!!AppInsights.downloadAndSetup) {
  AppInsights.downloadAndSetup({
    instrumentationKey: '3f0e2dcb-ab20-4af4-8b4b-60ff9bbad653',
  });
  logic.on('MAKE_SUGGESTION', (p, m) => {
    console.log('MAKE_SUGGESTION');
    AppInsights.trackEvent('MAKE_SUGGESTION', p, m);
  });
  logic.on('ELEMENT_NOT_FOUND', (p, m) => {
    AppInsights.trackEvent('ELEMENT_NOT_FOUND', p, m);
  });
}

function setupChrome() {
  chrome.runtime.onMessage.addListener(
    async (command: StartSuggestionCommand, _sender, sendResponse) => {
      const earlyResponse: StartSuggestionResponse = {
        command,
        status: 'WAITING',
        type: 'START_SUGGESTION_RESPONSE',
      };
      sendResponse(earlyResponse);
      const runDialog = async (doc: SuggestionDocument) => {
        return dialog.doRun(
          doc.context.slice(0, doc.selectionStart),
          doc.selectedText,
          doc.context.slice(doc.selectedText.length + doc.selectionStart)
        );
      };
      const suggestion = await logic.getSuggestionFromUser(
        lastPointer,
        command,
        runDialog
      );
      if (suggestion.textNodeIndex > -1) {
        logic.sendMakeSuggestion(suggestion);
      }
      AppInsights.flush();
      console.log('flushed');
    }
  );
}

if (chrome.runtime.onMessage) {
  setupChrome();
} else {
  console.log('local testing');
}
