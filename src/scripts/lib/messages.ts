export type ParentAndIndex = [string, number];

export interface MakeSuggestionMessage {
  type: 'MAKE_SUGGESTION';
  elementPath: ParentAndIndex[];
  context: string;
  textNodeIndex: number;
  selectedText: string;
  selectionStart: number;
  suggestedText: string;
  href: string;
}

export interface StartSuggestionMessage {
  type: 'START_SUGGESTION';
  selectionText: string;
}

export type Message = MakeSuggestionMessage | StartSuggestionMessage;
