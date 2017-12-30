import { DocumentClient, QueryError, RetrievedDocument } from 'documentdb';

import { SuggestionDocument } from '../models';
import { AbstractDao } from './abstract-dao';

export class SuggestionDao extends AbstractDao<SuggestionDocument> {
  constructor(
    client: DocumentClient,
    databaseId: string,
    collectionId: string
  ) {
    super(client, databaseId, collectionId);
  }
  public getByHref(
    href: string,
    callback: (
      err: QueryError | null,
      obj?: SuggestionDocument[],
      doc?: RetrievedDocument[]
    ) => void
  ): void {
    this.getMany(
      {
        query: 'SELECT * FROM root r WHERE r.href = @href',
        parameters: [
          {
            name: '@href',
            value: href,
          },
        ],
      },
      callback
    );
  }
}
