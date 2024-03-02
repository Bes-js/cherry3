export = Model;

interface UpdateKeys {
   $set?: object;
   $unset?: object;
   $push?: object;
   $pull?: object;
   $inc?: object;
   $dec?: object;
}

interface aggregateOptions {
    $match?: object;
    $project?: object;
    $limit?: number;
    $skip?: number;
    $unwind?: object;
    $group?: object;
    $sort?: object;
    $count?: string;
    $lookup?: object;
    $addFields?: object;
    $replaceRoot?: object;
    $sample?: object;
    $out?: string;
    $indexStats?: object;
    $facet?: object;
    $graphLookup?: object;
    $bucket?: object;
    $bucketAuto?: object;
    $sortByCount?: object;

}


/**
 * Represents a set of functions for interacting with a database.
 */


declare class Model {
    collection: string;
    schema: object;
    methods?: object;
    constructor(collection: string, schema: object, methods?: object);

    aggregate(pipeline: object[]): Promise<any[]>;

    find(filter: object, options?: { multi?:boolean, limit?:number }): Promise<any[]>;

    findOne(filter: object, options?: { multi?:boolean }): Promise<any | null>;

    findOneAndUpdate(filter: object, update: UpdateKeys, options?: { new?:boolean, upsert?:boolean }): Promise<any | null>;

    findOneAndDelete(filter: object, options?: { multi?:false }): Promise<any | null>;

    findById(id: any, options?: { }): Promise<any | null>;

    findByIdAndUpdate(id: any, update: UpdateKeys, options?: { new?:boolean, upsert?:boolean }): Promise<any | null>;

    findByIdAndDelete(id: any, options?: { multi?:false }): Promise<any | null>;

    insertOne(data: any, options?: { multi?:false }): Promise<any>;

    insertMany(data: object[]): Promise<any>;

    updateOne(filter: object, update: UpdateKeys, options?: { upsert?:boolean }): Promise<any | null>;

    updateMany(filter: object, update: UpdateKeys, options?: { upsert?:boolean }): Promise<any[]>;

    deleteOne(filter: object, options?: { multi?:false }): Promise<any | null>;

    deleteMany(filter: object, options?: { multi?:true }): Promise<any[]>;

    create(data: any, options?: { multi?:true }): Promise<any>;

    save(data: any): Promise<any>;

    update(filter: object, update: UpdateKeys, options?: { multi?:true, upsert?:boolean }): Promise<any>;

    schemaInfo(): Promise<any>;

    dropCollection(): Promise<any>;

    allRows(options?:{ limit?:number }): Promise<any[]>;

}


