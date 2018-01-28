export type ParentAndIndex = [string, number];

export interface SuggestionDocument {
  context: string;
  createdAt: number;
  elementPath: string;
  id: string;
  location: string;
  selectedText: string;
  selectionStart: number;
  submitter: string;
  suggestedText?: string;
  textNodeIndex: number;
  url: {
    hash: string;
    host: string;
    pathname: string;
    protocol: string;
    search: string;
  };
}
