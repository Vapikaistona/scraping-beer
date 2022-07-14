import { Collection, Db } from "mongodb";
import { BrewerySchema } from "./schemas/brewery";
export class Brewery {
    collection: Collection;
    constructor(database: Db){
        this.collection = database.collection('breweries');
    }

    async fullUpdate(sku: string, item: BrewerySchema){
        return this.collection.updateOne({ sku }, item);
    };
    async partialUpdate(sku: string, properties: any){
        return this.collection.updateOne({ sku }, { $set: { ...properties }});
    };
    async insert(item: BrewerySchema){
        return this.collection.insertOne({ ...item });
    };
    async get(query: any){
        return this.collection.find(query);
    };
}