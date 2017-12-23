export type ParentAndIndex = [string, number];

export type SuggestionStatus = 'WAITING' | 'ERROR' | 'OK' | 'TEST';

export interface MakeSuggestionMessage {
  id: string;
  type: 'MAKE_SUGGESTION';
  elementPath: ParentAndIndex[];
  context: string;
  textNodeIndex: number;
  selectedText: string;
  selectionStart: number;
  suggestedText?: string;
  href: string;
  status: SuggestionStatus;
  createdAt: number;
}

export interface StartSuggestionMessage {
  type: 'START_SUGGESTION';
  id: string;
  selectionText: string;
}

export type Message = MakeSuggestionMessage | StartSuggestionMessage;
