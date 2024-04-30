export = Model;

interface UpdateKeys {
   $set?: object;
   $unset?: object;
   $push?: object;
   $pull?: object;
   $inc?: object;
   $dec?: object;
   $pop?: object;
}

interface findOperators {
    $gt?: any;
    $gte?: any;
    $lt?: any;
    $lte?: any;
    $ne?: any;
    $nin?: any;
    $in?: any;
    $and?: any;
    $not?: any;
    $nor?: any;
    $or?: any;
    $exists?: any;
    $regex?: any;
    $nregex?: any;
    $between?: any;
    $nbetween?: any;
    $all?: any;
    $elementMatch?: any;
    $size?: any;
    $ceil?: any;

}

interface ReturnCreateType {
save:() => Promise<object|null>
}


/**
 * Represents a set of functions for interacting with a database.
 */

declare class Model {
    collection: string;
    schema: object;
    schemaOptions?: object;
    constructor(collection: string, schema: object, schemaOptions?: { $timestamps?: boolean });

    distinct(columnName: string): Promise<any[]>;

    find(filter: object | Record<any,findOperators>, options?: { $limit?:number, $skip?:number, $sort?:-1|1 }): Promise<object[] | any[]>;

    findOne(filter: object | Record<any,findOperators>): Promise<object | null>;

    findOneAndUpdate(filter: object | Record<any,findOperators>, update: UpdateKeys, options?: { $upsert?:boolean, $multiPull?:boolean }): Promise<object | null>;

    findOneAndDelete(filter: object | Record<any,findOperators>, options?: {}): Promise<object | null>;

    findById(id: number): Promise<object | null>;

    findByIdAndUpdate(id: number, update: UpdateKeys, options?: { $upsert?:boolean, $multiPull?:boolean }): Promise<object | null>;

    findByIdAndDelete(id: number): Promise<object | null>;

    insertOne(data: any, options?: {}): Promise<object | null>;

    insertMany(data: object[]): Promise<object[] | any | null>;

    updateOne(filter: object | Record<any,findOperators>, update: UpdateKeys, options?: { $upsert?:boolean, $multiPull?:boolean }): Promise<object | null>;

    updateMany(filter: object | Record<any,findOperators>, update: UpdateKeys, options?: { $upsert?:boolean, $multiPull?:boolean }): Promise<object[] | any[] | any | null>;

    deleteOne(filter: object | Record<any,findOperators>, options?: {}): Promise<object | null>;

    deleteMany(filter: object | Record<any,findOperators>, options?: {}): Promise<number | null>;

    create(data: object | any, options?: { $multi?: true }): Promise<{ save: () => Promise<object | null> }>;

    update(filter: object | Record<any,findOperators>, update: UpdateKeys, options?: { $multi?:true, $upsert?:boolean, $multiPull?:boolean }): Promise<object | null>;

    schemaInfo(): Promise<object>;

    dropCollection(): Promise<undefined>;

    renameCollection(newCollectionName: string): Promise<true | Error>;

    renameColumn(oldColumnName: string, newColumnName: string): Promise<true | Error>;

    deleteColumn(columnName: string): Promise<true | Error>;

    allRows(options?:{ $limit?:number, $skip?:number, $sort?:-1|1 }): Promise<object[] | any[]>;

}


