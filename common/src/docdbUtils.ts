import {
  CollectionMeta,
  DatabaseMeta,
  DocumentClient,
  DocumentQuery,
  QueryError,
} from 'documentdb';

export class DocdbUtils {
  public static getOrCreateDatabase(
    client: DocumentClient,
    databaseId: string,
    callback: (err: QueryError | null, database?: DatabaseMeta) => void
  ) {
    const querySpec: DocumentQuery = {
      query: 'SELECT * FROM root r WHERE r.id= @id',
      parameters: [
        {
          name: '@id',
          value: databaseId,
        },
      ],
    };

    client.queryDatabases(querySpec).toArray((err, results: DatabaseMeta[]) => {
      if (err) {
        callback(err);
      } else {
        if (results.length === 0) {
          const databaseSpec = {
            id: databaseId,
          };

          client.createDatabase(databaseSpec, (err1, created: DatabaseMeta) => {
            callback(null, created);
          });
        } else {
          callback(null, results[0]);
        }
      }
    });
  }

  public static getOrCreateCollection(
    client: DocumentClient,
    databaseLink: string,
    collectionId: string,
    callback: (err: QueryError | null, collection?: CollectionMeta) => void
  ) {
    const querySpec: DocumentQuery = {
      query: 'SELECT * FROM root r WHERE r.id=@id',
      parameters: [
        {
          name: '@id',
          value: collectionId,
        },
      ],
    };

    client.queryCollections(databaseLink, querySpec).toArray((err, results) => {
      if (err) {
        callback(err);
      } else {
        if (results.length === 0) {
          const collectionSpec = {
            id: collectionId,
          };

          client.createCollection(
            databaseLink,
            collectionSpec,
            (err1, created) => {
              callback(null, created);
            }
          );
        } else {
          callback(null, results[0]);
        }
      }
    });
  }
}
