import { DocumentClient } from 'documentdb';
import { SuggestionDao } from './imported/common/lib/data/suggestion-dao';
import { SuggestionDocument } from './imported/common/lib/models';
import { environment } from './imported/common/lib/imported/environments/environment';

const { host, masterKey } = environment.mainDb;
const client = new DocumentClient(host, { masterKey: masterKey });

type Doc = SuggestionDocument;

interface Context {
  log(...message: any[]): void;
  done(): void;
  bindings: never;
  res: Response;
}

interface Request {
  method: 'GET' | 'POST';
  query: { location?: string };
}

type ResponseBody = Doc[];

interface Response {
  status: number;
  body: ResponseBody | string;
}

const dao = new SuggestionDao(client, 'Main', 'Suggestions');

export default function(context: Context, req: Request) {
  const response: Response = {
    status: 400,
    body: 'Invalid Request',
  };
  function getDocuments(location: string): Promise<SuggestionDocument[]> {
    context.log(location);
    return new Promise<SuggestionDocument[]>((resolve, reject) => {
      dao.init((err, coll) => {
        if (coll) {
          dao.getByLocation(location, (err2, suggestions) => {
            if (err2) {
              context.log(err2);
              reject(err2);
            } else if (suggestions) {
              resolve(suggestions);
            }
          });
        } else {
          context.log(err!);
          reject(err);
        }
      });
    });
  }

  function finishUp() {
    context.res = response;
    context.done();
  }

  if (req.method === 'GET') {
    if (req.query.location) {
      response.status = 200;
      getDocuments(req.query.location).then(
        (documents: SuggestionDocument[]) => {
          response.body = documents;
          finishUp();
        }
      );
    } else {
      finishUp();
    }
  } else {
    finishUp();
  }
}
