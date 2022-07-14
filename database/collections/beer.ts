import { Collection, Db } from "mongodb";
import { BeerSchema } from "./schemas/beer";
export class Beer {
    collection: Collection;
    constructor(database: Db){
        this.collection = database.collection('beers');
    }

    async fullUpdate(sku: string, item: BeerSchema){
        return this.collection.updateOne({ sku }, item);
    };
    async partialUpdate(sku: string, properties: any){
        return this.collection.updateOne({ sku }, { $set: { ...properties }});
    };
    async insert(item: BeerSchema){
        return this.collection.insertOne({ ...item });
    };
    async get(query: any){
        return this.collection.find(query);
    };
}