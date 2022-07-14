import { Db, MongoClient } from 'mongodb';
import { mongoConfig } from './config';

export module mongo {
  let client: MongoClient;
  let db: Db = null;

  export async function init(){
    if(!client){
      client = new MongoClient(mongoConfig.url);
      await client.connect();
    }
    if (!db){
      db = client.db(mongoConfig.dbName);
    }
    return db;
  }
  export async function close(){
    await client.close();
  }
};