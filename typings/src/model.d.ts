// typings/index.d.ts


type PrimitiveTypes = StringConstructor | NumberConstructor | BooleanConstructor | ObjectConstructor | ArrayConstructor | DateConstructor;

interface DetailedFieldDefinition {
  type: PrimitiveTypes;
  default?: any;
  required?: boolean;
}

type FieldDefinition = PrimitiveTypes | DetailedFieldDefinition;

type SchemaDefinition = Record<string, FieldDefinition>;

type returnTypes = {
    id?: number;
    createdAt?: string;
    updatedAt?: string;
 } 

interface UpdateKeys {
  $set?: object;
  $unset?: object;
  $push?: object;
  $pull?: object;
  $inc?: object;
  $dec?: object;
  $pop?: object;
}

interface FindOperators {
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
  save: () => Promise<object | null>;
}

type ExtractPrimitiveType<T> = T extends StringConstructor
  ? string | null
  : T extends NumberConstructor
  ? number | null
  : T extends BooleanConstructor
  ? boolean | null
  : T extends ObjectConstructor
  ? object | null
  : T extends ArrayConstructor
  ? Array<any> | Function
  : T extends DateConstructor
  ? Date
  : any;

type ExtractFieldType<T> = T extends PrimitiveTypes
  ? ExtractPrimitiveType<T>
  : T extends DetailedFieldDefinition
  ? ExtractPrimitiveType<T['type']>
  : never;

type ExtractSchemaType<T extends SchemaDefinition> = {
  [K in keyof T]: ExtractFieldType<T[K]>;
};

interface UpdateTypes<T extends SchemaDefinition> {
    $set?: Partial<ExtractSchemaType<T>>;
    $unset?: Partial<ExtractSchemaType<T>>;
    $push?: Partial<ExtractSchemaType<T>>;
    $pull?: Partial<ExtractSchemaType<T>>;
    $inc?: Partial<ExtractSchemaType<T>>;
    $dec?: Partial<ExtractSchemaType<T>>;
    $pop?: Partial<ExtractSchemaType<T>>;
    }


/**
* Represents a function that creates a schema object.
* @param values - An object representing the schema values.
* @returns A schema object.
*/
declare function Schema<T extends SchemaDefinition>(definition: T): T;

/**
 * Represents a set of functions for interacting with a database.
 */
declare class Model<T extends SchemaDefinition> {
  collection: string;
  schema: T;
  schemaOptions?: { $timestamps?: boolean };

  constructor(collection: string, schema: T, schemaOptions?: { $timestamps?: boolean, $debug?: boolean });


  distinct(field: keyof ExtractSchemaType<T>,group?:boolean): Promise<any[]>;

  find(
    filter: Partial<ExtractSchemaType<T>> | Record<string, FindOperators>,
    options?: { $limit?: number; $skip?: number; $sort?: -1 | 1 }
  ): Promise<(ExtractSchemaType<T> & object & returnTypes)[] | []>;

  findOne(filter: Partial<ExtractSchemaType<T>>): Promise<ExtractSchemaType<T> & object & returnTypes | null>;

  findOneAndUpdate(
    filter: Partial<ExtractSchemaType<T>> | Record<string, FindOperators>,
    update: UpdateTypes<T>,
    options?: { $upsert?: boolean; $multiPull?: boolean }
  ): Promise<ExtractSchemaType<T> & object & returnTypes | null>;

  findOneAndDelete(
    filter: Partial<ExtractSchemaType<T>> | Record<string, FindOperators>,
    options?: {}
  ): Promise<ExtractSchemaType<T> & object & returnTypes | null>;

  findById(id: number): Promise<ExtractSchemaType<T> & object & returnTypes | null>;

  findByIdAndUpdate(
    id: number,
    update: UpdateKeys,
    options?: { $upsert?: boolean; $multiPull?: boolean }
  ): Promise<ExtractSchemaType<T> & object & returnTypes | null>;

  findByIdAndDelete(id: number): Promise<ExtractSchemaType<T> & object & returnTypes | null>;

  insertOne(data: ExtractSchemaType<T>, options?: {}): Promise<ExtractSchemaType<T> & object & returnTypes | null>;

  insertMany(data: ExtractSchemaType<T>[]): Promise<(ExtractSchemaType<T> & object & returnTypes)[] | any | null>;

  updateOne(
    filter: Partial<ExtractSchemaType<T>> | Record<string, FindOperators>,
    update: UpdateKeys,
    options?: { $upsert?: boolean; $multiPull?: boolean }
  ): Promise<ExtractSchemaType<T> & object & returnTypes | null>;

  updateMany(
    filter: Partial<ExtractSchemaType<T>> | Record<string, FindOperators>,
    update: UpdateKeys,
    options?: { $upsert?: boolean; $multiPull?: boolean }
  ): Promise<(ExtractSchemaType<T> & object & returnTypes)[] | any[] | any | null>;

  deleteOne(
    filter: Partial<ExtractSchemaType<T>> | Record<string, FindOperators>,
    options?: {}
  ): Promise<ExtractSchemaType<T> & object & returnTypes | null>;

  deleteMany(
    filter: Partial<ExtractSchemaType<T>> | Record<string, FindOperators>,
    options?: {}
  ): Promise<number | null>;

  create(data: ExtractSchemaType<T> | any, options?: { $multi?: true }): Promise<ReturnCreateType>;

  update(
    filter: Partial<ExtractSchemaType<T>> | Record<string, FindOperators>,
    update: UpdateKeys,
    options?: { $multi?: true; $upsert?: boolean; $multiPull?: boolean }
  ): Promise<ExtractSchemaType<T> & object & returnTypes | null>;

  schemaInfo(): Promise<object>;

  dropCollection(): Promise<undefined>;

  renameCollection(newCollectionName: string): Promise<true | Error>;

  renameColumn(oldColumnName: string, newColumnName: string): Promise<true | Error>;

  deleteColumn(columnName: string): Promise<true | Error>;

  allRows(options?: { $limit?: number; $skip?: number; $sort?: -1 | 1 }): Promise<(ExtractSchemaType<T> & object & returnTypes)[] | []>;
}

export { Model, Schema };
