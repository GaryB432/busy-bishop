import '../styles/content.scss';

import {
  FakePopup,
  Logic,
  MessageBusChrome,
  StartSuggestionCommand,
  StartSuggestionResponse,
} from './lib/logic';

function setup() {
  const logic = new Logic(new MessageBusChrome());
  const dialog = new FakePopup();
  chrome.runtime.onMessage.addListener(
    async (command: StartSuggestionCommand, _sender, sendResponse) => {
      const earlyResponse: StartSuggestionResponse = {
        type: 'START_SUGGESTION_RESPONSE',
        command,
        status: 'WAITING',
      };
      sendResponse(earlyResponse);
      try {
        const suggestedText = await dialog.doRun(
          'a',
          command.selectionText,
          'c'
        );
        logic.createAndSendMakeCommand(
          document,
          command,
          'context',
          suggestedText
        );
      } finally {
      }
    }
  );
}
setup();
