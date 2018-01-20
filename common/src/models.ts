export type ParentAndIndex = [string, number];

export interface SuggestionDocument {
  id: string;
  elementPath: string;
  context: string;
  textNodeIndex: number;
  selectedText: string;
  selectionStart: number;
  submitter : string;
  suggestedText?: string;
  href: string;
  createdAt: number;
}
