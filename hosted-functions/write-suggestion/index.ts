import { SuggestionDocument } from './imported/models';

interface Doc extends SuggestionDocument {
  clientIP: string;
}

interface Headers {
  [name: string]: string;
}

interface Bindings {
  suggestionDocument: Doc;
}

interface Context {
  log(...message: any[]): void;
  done(): void;
  bindings: Bindings;
  res: Response;
}
interface Request {
  method: 'GET' | 'POST';
  headers: Headers;
  body: string;
  query: any;
}

interface Response {
  status: number;
  body: string;
}

export default (context: Context, req: Request) => {
  const res: Response = {
    status: 400,
    body: 'Invalid Request',
  };
  if (req.method === 'POST') {
    if (req.body) {
      res.status = 201;
      const suggestion: Doc = JSON.parse(req.body);
      suggestion.clientIP = req.headers['x-forwarded-for'].split(':')[0];
      context.bindings.suggestionDocument = suggestion;
      res.body = JSON.stringify(suggestion);
    }
  }
  context.res = res;
  context.done();
};
