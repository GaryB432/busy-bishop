import { MakeSuggestionCommand, StartSuggestionCommand } from '../models';

export abstract class MessageSender {
  public abstract send(
    command: StartSuggestionCommand | MakeSuggestionCommand
  ): void;
}
