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
