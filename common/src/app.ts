/* tslint:disable:no-console */
import { DatabaseMeta, DocumentClient, UniqueId } from 'documentdb';

import { environment } from './environments/environment';

const client = new DocumentClient(environment.dbhost, {
  masterKey: environment.dbauthKey,
});

const databaseDefinition: UniqueId = { id: 'sample database' };
const collectionDefinition: UniqueId = { id: 'sample collection' };
const documentDefinition: any = {
  id: 'hello world doc',
  content: 'Hello World!',
};

client.createDatabase(databaseDefinition, (err, database) => {
  if (err) {
    return console.log(err);
  }
  console.log('created db');

  client.createCollection(
    database._self,
    collectionDefinition,
    (err1, collection) => {
      if (err1) {
        return console.log(err1);
      }
      console.log('created collection');

      client.createDocument(
        collection._self,
        documentDefinition,
        (err2, document) => {
          if (err2) {
            return console.log(err2);
          }
          console.log('Created Document with content: ', document.content);

          cleanup(client, database);
        }
      );
    }
  );
});

function cleanup(cl: DocumentClient, database: DatabaseMeta) {
  cl.deleteDatabase(database._self, err => {
    if (err) {
      console.log(err);
    }
  });
}
