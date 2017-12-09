export interface MakeSuggestionMessage {
  type: "MAKE_SUGGESTION";
  original: string;
  selectionLength: number;
  selectionStart: number;
  suggestedText: string;
  href: string;
}

export interface StartSuggestionMessage {
  type: "START_SUGGESTION";
  selectionText: string;
}

export type Message = MakeSuggestionMessage | StartSuggestionMessage;