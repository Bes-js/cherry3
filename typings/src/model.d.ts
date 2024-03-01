export = Model;

interface UpdateKeys {
   $set?: object;
   $unset?: object;
   $push?: object;
   $pull?: object;
   $inc?: object;
   $dec?: object;
}



/**
 * Represents a set of functions for interacting with a database.
 */


declare class Model {
    collection: string;
    schema: object;
    methods?: object;
    constructor(collection: string, schema: object, methods?: object);

    find(filter: object, options?: { multi?:boolean }): Promise<any[]>;

    findOne(filter: object, options?: { multi?:boolean }): Promise<any | null>;

    findOneAndUpdate(filter: object, update: UpdateKeys, options?: { new?:boolean, upsert?:boolean }): Promise<any | null>;

    findOneAndDelete(filter: object, options?: { multi?:false }): Promise<any | null>;

    findById(id: any, options?: { }): Promise<any | null>;

    findByIdAndUpdate(id: any, update: UpdateKeys, options?: { new?:boolean, upsert?:boolean }): Promise<any | null>;

    findByIdAndDelete(id: any, options?: { multi?:false }): Promise<any | null>;

    insertOne(data: any, options?: { multi?:false }): Promise<any>;

    insertMany(data: any, options?: { multi?:true }): Promise<any>;

    updateOne(filter: object, update: UpdateKeys, options?: { upsert?:boolean }): Promise<any | null>;

    updateMany(filter: object, update: UpdateKeys, options?: { upsert?:boolean }): Promise<any[]>;

    deleteOne(filter: object, options?: { multi?:false }): Promise<any | null>;

    deleteMany(filter: object, options?: { multi?:true }): Promise<any[]>;

    create(data: any, options?: { multi?:true }): Promise<any>;

    save(data: any): Promise<any>;

    update(filter: object, update: UpdateKeys, options?: { multi?:true, upsert?:boolean }): Promise<any>;

    schemaInfo(): Promise<any>;

    dropCollection(): Promise<any>;

    allRows(): Promise<any[]>;

}


