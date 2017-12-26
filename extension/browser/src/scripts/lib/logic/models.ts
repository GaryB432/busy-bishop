export type ParentAndIndex = [string, number];

export interface SuggestionDocument {
  id: string;
  elementPath: ParentAndIndex[];
  context: string;
  textNodeIndex: number;
  selectedText: string;
  selectionStart: number;
  suggestedText?: string;
  href: string;
  createdAt: number;
}
export interface StartSuggestionCommand {
  type: 'START_SUGGESTION';
  id: string;
  selectionText: string;
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
