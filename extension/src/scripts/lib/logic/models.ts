import { SuggestionDocument } from '../../../imported/models';

export interface StartSuggestionCommand {
  type: 'START_SUGGESTION';
  id: string;
  selectionText: string;
  submitter: string;
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
