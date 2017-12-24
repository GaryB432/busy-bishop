import '../styles/content.scss';

import {
  FakePopup,
  Logic,
  MessageBusChrome,
  StartSuggestionCommand,
} from './lib/logic';

function setup() {
  const logic = new Logic(new MessageBusChrome());
  const dialog = new FakePopup();
  chrome.runtime.onMessage.addListener(
    async (command: StartSuggestionCommand, sender, sendResponse) => {
      console.log(command, sender, 'using parameters!');
      try {
        const suggestedText = await dialog.doRun('a', 'b', 'c');
        logic.createAndSendMakeCommand(
          document,
          command,
          'context',
          suggestedText
        );
      } finally {
        sendResponse(47);
      }
    }
  );
}
setup();
