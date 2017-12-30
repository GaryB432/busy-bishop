// https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-node


interface SuggestionDocumentV1 {
  id: string;
  elementPath: string;
  context: string;
  textNodeIndex: number;
  selectedText: string;
  selectionStart: number;
  suggestedText?: string;
  href: string;
  createdAt: number;
}

export type Doc = SuggestionDocumentV1;

export interface Bindings {
  suggestionDocument: Doc;
}

export interface Context {
  log(...message: any[]): void;
  done(): void;
  bindings: Bindings;
  res: Response;
}

export interface Request {
  method: "GET" | "POST";
  body: Doc;
  query: any;
}

type ResponseBody = Doc;

export interface Response {
  status: number;
  body: ResponseBody | string;
}

export default (context: Context, req: Request) => {
  const res: Response = {
    status: 400,
    body: 'Invalid Request'
  }
  if (req.method === "POST") {
    if (req.body) {
      res.status = 201;
      const suggestion: Doc = req.body;
      context.bindings.suggestionDocument = suggestion;
      res.body = JSON.stringify(suggestion);
    }
  }
  context.res = res;
  context.done();
};
