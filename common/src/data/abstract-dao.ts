import {
  CollectionMeta,
  DatabaseMeta,
  DocumentClient,
  DocumentQuery,
  NewDocument,
  QueryError,
  RetrievedDocument,
  UniqueId,
} from 'documentdb';
import { DocdbUtils } from './docdbUtils';

export abstract class AbstractDao<T> {
  private database: DatabaseMeta;
  private collection: CollectionMeta;
  constructor(
    protected client: DocumentClient,
    private databaseId: string,
    private collectionId: string
  ) {}
  public init(
    callback: (err: QueryError | null, collection?: CollectionMeta) => void
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
              this.collection = coll!;
              callback(err1, this.collection);
            }
          }
        );
      }
    });
  }
  // public find(
  //   querySpec: DocumentQuery,
  //   callback: (err: QueryError | null, doc?: T[]) => void
  // ) {
  //   this.getMany(querySpec, (err, _b, objs) => {
  //     callback(err, objs);
  //   });
  // }
  public add(item: T, callback: (err: QueryError | null, obj?: T) => void) {
    const nd: NewDocument = { ...(item as any) };
    this.client.createDocument<T>(this.collection._self, nd, (err, dbdoc) => {
      if (err) {
        callback(err);
      } else {
        callback(null, this.transform(dbdoc));
      }
    });
  }
  public update(
    item: T,
    callback: (err: QueryError | null, collection?: T[]) => void
  ) {
    const idHaver: UniqueId = { ...(item as any) };
    this.getById(idHaver.id, (err, oldObj, oldDoc) => {
      if (err) {
        callback(err);
      } else {
        if (!!oldDoc) {
          const subject: NewDocument = { oldObj, ...(item as any) };
          this.client.replaceDocument(
            oldDoc._self,
            subject,
            (err1, replaced) => {
              if (err1) {
                callback(err1);
              } else {
                callback(null, [this.transform(replaced)]);
              }
            }
          );
        }
      }
    });
  }

  public getOne(
    query: DocumentQuery,
    callback: (err: QueryError | null, obj?: T, doc?: RetrievedDocument) => void
  ) {
    this.getMany(query, (err, objs, docs) => {
      if (docs && objs) {
        callback(null, objs[0], docs[0]);
        console.log(objs[0]);
      } else {
        console.log(err);
      }
    });
  }

  public getMany(
    query: DocumentQuery,
    callback: (
      err: QueryError | null,
      obj?: T[],
      doc?: RetrievedDocument[]
    ) => void
  ) {
    this.client
      .queryDocuments(this.collection._self, query)
      .toArray((err, results) => {
        if (err) {
          callback(err);
        } else {
          callback(null, results.map(this.transform), results);
        }
      });
  }

  public getById(
    itemId: string,
    callback: (err: QueryError | null, obj?: T, doc?: RetrievedDocument) => void
  ) {
    const querySpec: DocumentQuery = {
      query: 'SELECT * FROM root r WHERE r.id = @id',
      parameters: [
        {
          name: '@id',
          value: itemId,
        },
      ],
    };

    this.getOne(querySpec, callback);
  }
  protected transform(doc: RetrievedDocument): T {
    const obj: T = { ...(doc as any) };
    return obj;
  }
}
