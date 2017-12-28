import {
  CollectionMeta,
  DatabaseMeta,
  DocumentClient,
  DocumentQuery,
  QueryError,
  RetrievedDocument,
} from 'documentdb';
import { DocdbUtils } from './docdbUtils';

class SuggestionDao {
  private database: DatabaseMeta;
  private collection: any | null = null;
  constructor(
    private client: DocumentClient,
    private databaseId: string,
    private collectionId: string
  ) {}
  public init(
    callback: (err: QueryError | null, collection?: CollectionMeta) => any
  ) {
    DocdbUtils.getOrCreateDatabase(this.client, this.databaseId, (err, db) => {
      if (err) {
        callback(err);
      } else if (!!db) {
        this.database = db;
        DocdbUtils.getOrCreateCollection(
          this.client,
          this.database._self,
          this.collectionId,
          (err1, coll) => {
            if (err1) {
              callback(err1);
            } else {
              this.collection = coll;
            }
          }
        );
      }
    });
  }
  public find(
    querySpec: DocumentQuery,
    callback: (err: QueryError | null, doc?: RetrievedDocument[]) => void
  ) {
    this.client
      .queryDocuments(this.collection._self, querySpec)
      .toArray((err, results) => {
        if (err) {
          callback(err);
        } else {
          callback(null, results);
        }
      });
  }
  public addItem(
    item: any,
    callback: (err: QueryError | null, doc?: RetrievedDocument) => any
  ) {
    item.date = Date.now();
    item.completed = false;

    this.client.createDocument(this.collection._self, item, (err, doc) => {
      if (err) {
        callback(err);
      } else {
        callback(null, doc);
      }
    });
  }

  public updateItem(
    itemId: string,
    callback: (err: QueryError | null, collection?: CollectionMeta) => any
  ) {
    this.getItem(itemId, (err, doc) => {
      if (err) {
        callback(err);
      } else {
        if (!!doc) {
          doc.completed = true;

          this.client.replaceDocument(doc._self, doc, (err1, replaced) => {
            if (err1) {
              callback(err1);
            } else {
              callback(null, replaced);
            }
          });
        }
      }
    });
  }

  public getItem(
    itemId: string,
    callback: (err: QueryError | null, doc?: RetrievedDocument) => any
  ) {
    const querySpec = {
      query: 'SELECT * FROM root r WHERE r.id = @id',
      parameters: [
        {
          name: '@id',
          value: itemId,
        },
      ],
    };

    this.client
      .queryDocuments(this.collection._self, querySpec)
      .toArray((err, results) => {
        if (err) {
          callback(err);
        } else {
          callback(null, results[0]);
        }
      });
  }
}
