import { DocumentClient } from 'documentdb';
import { DocdbUtils } from './docdbUtils';

class TaskDao {
  private database: any | null = null;
  private collection: any | null = null;
  constructor(
    private client: DocumentClient,
    private databaseId: string,
    private collectionId: string
  ) {}
  public init(callback: any) {
    DocdbUtils.getOrCreateDatabase(
      this.client,
      this.databaseId,
      (err: any, db: any) => {
        if (err) {
          callback(err);
        } else {
          this.database = db;
          DocdbUtils.getOrCreateCollection(
            this.client,
            this.database._self,
            this.collectionId,
            (err1: any, coll: any) => {
              if (err1) {
                callback(err1);
              } else {
                this.collection = coll;
              }
            }
          );
        }
      }
    );
  }
  public find(querySpec: any, callback: any) {
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
  public addItem(item: any, callback: any) {
    item.date = Date.now();
    item.completed = false;

    this.client.createDocument(
      this.collection._self,
      item,
      (err: any, doc: any) => {
        if (err) {
          callback(err);
        } else {
          callback(null, doc);
        }
      }
    );
  }

  public updateItem(itemId: any, callback: any) {
    this.getItem(itemId, (err: any, doc: any) => {
      if (err) {
        callback(err);
      } else {
        doc.completed = true;

        this.client.replaceDocument(
          doc._self,
          doc,
          (err: any, replaced: any) => {
            if (err) {
              callback(err);
            } else {
              callback(null, replaced);
            }
          }
        );
      }
    });
  }

  public getItem(itemId: any, callback: any) {
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
      .toArray((err: any, results: any) => {
        if (err) {
          callback(err);
        } else {
          callback(null, results[0]);
        }
      });
  }
}
