import { Collection, Db, ObjectId } from "mongodb";
import { BeerSchema } from "./schemas/beer";
export class Beer {
    collection: Collection;
    constructor(database: Db){
        this.collection = database.collection('beers');
    }

    async fullUpdate(id: ObjectId, item: BeerSchema){
        return this.collection.updateOne({ _id: id }, item);
    };
    async partialUpdate(id: ObjectId, properties: any){
        return this.collection.updateOne({ _id: id }, { $set: { ...properties }});
    };
    async insert(item: BeerSchema){
        return this.collection.insertOne({ ...item });
    };
    async get(query: any){
        return this.collection.find(query).toArray();
    };
    async getOne(query: any): Promise<any>{
        return this.collection.findOne(query);
    };
}