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

type ExtractPrimitiveReturnType<T> = T extends StringConstructor
  ? string | null
  : T extends NumberConstructor
  ? number | null
  : T extends BooleanConstructor
  ? boolean | null
  : T extends ObjectConstructor
  ? object | null
  : T extends ArrayConstructor
  ? Array<any>
  : T extends DateConstructor
  ? Date
  : any;

type ExtractFieldType<T> = T extends PrimitiveTypes
  ? ExtractPrimitiveType<T>
  : T extends DetailedFieldDefinition
  ? ExtractPrimitiveType<T['type']>
  : never;

  type ExtractFieldReturnType<T> = T extends PrimitiveTypes
  ? ExtractPrimitiveReturnType<T>
  : T extends DetailedFieldDefinition
  ? ExtractPrimitiveReturnType<T['type']>
  : never;

type ExtractSchemaType<T extends SchemaDefinition> = {
  [K in keyof T]: ExtractFieldType<T[K]>;
};

type ExtractSchemaReturnType<T extends SchemaDefinition> = {
  [K in keyof T]: ExtractFieldReturnType<T[K]>;
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


interface aggregateOperators {
    $eq?: any;
    $gt?: any;
    $gte?: any;
    $lt?: any;
    $lte?: any;
    $ne?: any;
    $in?: any;
    $nin?: any;
    $exists?: any;
    $match?: any;
    $or?: any;
    $and?: any;
    $notRegexp?: any;
    $iRegexp?: any;
    $notIRegexp?: any;
    $overlap?: any;
    $adjacent?: any;
    $strictLeft?: any;
    $strictRight?: any;
    $noExtendRight?: any;
    $noExtendLeft?: any;
    $col?: any;
    $substring?: any;
    $placeholder?: any;
    $regex?: any;
    $all?: any;
    $startsWith?: any;
    $endsWith?: any;
    $like?: any;
    $notLike?: any;
    $iLike?: any;
    $notILike?: any;
    $contains?: any;
    $contained?: any;
    $any?: any;
    $between?: any;
    $notBetween?: any;
    $is?: any;
    $type?: any;
    $literal?: any;
    $fn?: any;
    $json?: any;
    $cast?: any;
    $size?: any;
    $ceil?: any;
    $floor?: any;
    $round?: any;
    $abs?: any;
    $sqrt?: any;
    $log?: any;
    $log2?: any;
    $log10?: any;
    $exp?: any;
    $pow?: any;
    $acos?: any;
    $asin?: any;
    $atan?: any;
    $cos?: any;
    $cot?: any;
    $sin?: any;
    $tan?: any;
    $radians?: any;
    $degrees?: any;
    $random?: any;
}

interface groupOptions<T extends SchemaDefinition> {
    $sum?: keyof ExtractSchemaType<T>;
    $avg?: keyof ExtractSchemaType<T>;
    $min?: keyof ExtractSchemaType<T>;
    $max?: keyof ExtractSchemaType<T>;
    $count?: keyof ExtractSchemaType<T>;
    $col?: keyof ExtractSchemaType<T>;
}


interface aggregateOptions<T extends SchemaDefinition> {
    $match?: Partial<ExtractSchemaType<T> | Record<any, aggregateOperators>>;
    $group?: Partial<ExtractSchemaType<T> | Record<any, Partial<groupOptions<T>>>>;
    $sort?: Partial<Record<keyof ExtractSchemaType<T>, 1 | -1>>;
    $skip?: number;
    $limit?: number;
    $project?: Partial<Record<keyof ExtractSchemaType<T>, 1 | 0 | true | false>>;
    $facet?: Partial<aggregateOptions<T>[]>;
    $unwind?: Partial<ExtractSchemaType<T> | Record<any, aggregateOperators>>;
    $addFields?: object | Record<any, aggregateOperators>;
    $count?: keyof ExtractSchemaType<T>;
    $unset?: (keyof ExtractSchemaType<T>)[] | string[];
    $set?: object;
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

  /**
   * Retrieves information about the database.
   * @returns An object containing the following properties:
   * - fileSize: The size of the database file.
   * - lastModified: The date and time when the database was last modified.
   * - createdAt: The date and time when the database was created.
   * - uid: The unique identifier of the database.
   * If the information is not available, it returns null.
   * @returns {object | null}
   */
  inspect(): Promise<string>;


  /**
   * counts the number of documents in a collection.
   * @param filter - The filter to apply to the collection.
   * @returns {number}
   * @returns {Promise<number>}
   * @example await model.countDocuments({name:'Bes-js'});
   */
  countDocuments(filter: Partial<ExtractSchemaType<T>> | Record<string, FindOperators>): Promise<number>;

  /**
   * Performs an aggregation operation on a collection.
   * @param pipeline - The aggregation pipeline to apply to the collection.
   * @returns {object[]}
   * @returns {Promise<object[]>}
   * @example await model.aggregate([{ $match:{ name:'Bes-js'} },{ $group:{ id:'name',total:{ $sum: 1 } } }]);
   */
  aggregate(pipeline: Partial<aggregateOptions<T>[]>): Promise<any[]>;


  /**
   * Retrieves distinct values from a collection.
   * @param field - The field to retrieve distinct values from.
   * @param group - Whether to group the distinct values.
   * @returns {any[]}
   * @returns {Promise<any[]>}
   * @example await model.distinct('name');
   * @example await model.distinct('name',true); 
   */
  distinct(field: keyof ExtractSchemaType<T>,group?:boolean): Promise<any[]>;

  /**
   * Finds documents in a collection.
   * @param filter - The filter to apply to the collection.
   * @param options - The options to apply to the query.
   * @returns {object[]}
   * @returns {Promise<object[]>}
   * @example await model.find({name:'Bes-js'},{ $limit: 10, $skip: 0, $sort: 1 });
   * @example await model.find({name:'Bes-js'},{ $limit: 10, $skip: 0, $sort: -1 }); 
   */
  find(
    filter?: Partial<ExtractSchemaType<T>> | Record<string, FindOperators>,
    options?: { $limit?: number; $skip?: number; $sort?: -1 | 1 }
  ): Promise<(ExtractSchemaType<T> & object & returnTypes)[] | []>;

  /**
   * Finds a single document in a collection.
   * @param filter - The filter to apply to the collection.
   * @returns {object | null}
   * @returns {Promise<object | null>}
   * @example await model.findOne({name:'Bes-js'});
   */
  findOne(filter: Partial<ExtractSchemaType<T>>): Promise<ExtractSchemaReturnType<T> & object & returnTypes | null>;

  /**
   * Finds a single document in a collection and updates it.
   * @param filter - The filter to apply to the collection.
   * @param update - The update to apply to the document.
   * @param options - The options to apply to the query.
   * @returns {object | null}
   * @returns {Promise<object | null>}
   * @example await model.findOneAndUpdate({name:'Bes-js'},{ $set:{name:'Bes-js'} },{ $upsert: true }); 
   */
  findOneAndUpdate(
    filter: Partial<ExtractSchemaType<T>> | Record<string, FindOperators>,
    update: UpdateTypes<T>,
    options?: { $upsert?: boolean; $multiPull?: boolean }
  ): Promise<ExtractSchemaReturnType<T> & object & returnTypes | null>;

  /**
   * Finds a single document in a collection and deletes it.
   * @param filter - The filter to apply to the collection.
   * @param options - The options to apply to the query.
   * @returns {object | null}
   * @returns {Promise<object | null>}
   * @example await model.findOneAndDelete({name:'Bes-js'});
   */
  findOneAndDelete(
    filter: Partial<ExtractSchemaType<T>> | Record<string, FindOperators>,
    options?: {}
  ): Promise<ExtractSchemaReturnType<T> & object & returnTypes | null>;

  /**
   * Finds a document by its identifier.
   * @param id - The identifier of the document.
   * @returns {object | null}
   * @returns {Promise<object | null>}
   * @example await model.findById(1);
   */
  findById(id: number): Promise<ExtractSchemaReturnType<T> & object & returnTypes | null>;

  /**
   * Updates a document by its identifier.
   * @param id - The identifier of the document.
   * @param update - The update to apply to the document.
   * @param options - The options to apply to the query.
   * @returns {object | null}
   * @returns {Promise<object | null>}
   * @example await model.findByIdAndUpdate(1,{ $set:{name:'Bes-js'} },{ $upsert: true });
   */
  findByIdAndUpdate(
    id: number,
    update: UpdateKeys,
    options?: { $upsert?: boolean; $multiPull?: boolean }
  ): Promise<ExtractSchemaReturnType<T> & object & returnTypes | null>;

  /**
   * Deletes a document by its identifier.
   * @param id - The identifier of the document.
   * @returns {object | null}
   * @returns {Promise<object | null>}
   * @example await model.findByIdAndDelete(1);
   */
  findByIdAndDelete(id: number): Promise<ExtractSchemaReturnType<T> & object & returnTypes | null>;

  /**
   * Inserts a document into a collection.
   * @param data - The document to insert into the collection.
   * @param options - The options to apply to the query.
   * @returns {object | null}
   * @returns {Promise<object | null>}
   * @example await model.insertOne({name:'Bes-js'});
   */
  insertOne(data: Partial<ExtractSchemaType<T>>, options?: {}): Promise<ExtractSchemaReturnType<T> & object & returnTypes | null>;

  /**
   * Inserts multiple documents into a collection.
   * @param data - The documents to insert into the collection.
   * @returns {object[] | null}
   * @returns {Promise<object[] | null>}
   * @example await model.insertMany([{name:'Bes-js'},{name:'Bes-js'}]);
   */
  insertMany(data:Partial<(ExtractSchemaType<T>)>[]): Promise<(ExtractSchemaReturnType<T> & object & returnTypes)[] | null>;

  /**
   * Updates a single document in a collection.
   * @param filter - The filter to apply to the collection.
   * @param update - The update to apply to the document.
   * @param options - The options to apply to the query.
   * @returns {object | null}
   * @returns {Promise<object | null>}
   * @example await model.updateOne({name:'Bes-js'},{ $set:{name:'Bes-js'} },{ $upsert: true });
   */
  updateOne(
    filter: Partial<ExtractSchemaType<T>> | Record<string, FindOperators>,
    update: UpdateKeys,
    options?: { $upsert?: boolean; $multiPull?: boolean }
  ): Promise<ExtractSchemaReturnType<T> & object & returnTypes | null>;

  /**
   * Updates multiple documents in a collection.
   * @param filter - The filter to apply to the collection.
   * @param update - The update to apply to the documents.
   * @param options - The options to apply to the query.
   * @returns {object[] | null}
   * @returns {Promise<object[] | null>}
   * @example await model.updateMany({name:'Bes-js'},{ $set:{name:'Bes-js'} },{ $upsert: true });
   */
  updateMany(
    filter: Partial<ExtractSchemaType<T>> | Record<string, FindOperators>,
    update: UpdateKeys,
    options?: { $upsert?: boolean; $multiPull?: boolean }
  ): Promise<(ExtractSchemaReturnType<T> & object & returnTypes)[] | any[] | any | null>;

  /**
   * Deletes a single document in a collection.
   * @param filter - The filter to apply to the collection.
   * @param options - The options to apply to the query.
   * @returns {object | null}
   * @returns {Promise<object | null>}
   * @example await model.deleteOne({name:'Bes-js'});
   */
  deleteOne(
    filter: Partial<ExtractSchemaType<T>> | Record<string, FindOperators>,
    options?: {}
  ): Promise<ExtractSchemaReturnType<T> & object & returnTypes | null>;

  /**
   * Deletes multiple documents in a collection.
   * @param filter - The filter to apply to the collection.
   * @param options - The options to apply to the query.
   * @returns {number | null}
   * @returns {Promise<number | null>}
   * @example await model.deleteMany({name:'Bes-js'},{ $multi: true });
   */
  deleteMany(
    filter: Partial<ExtractSchemaType<T>> | Record<string, FindOperators>,
    options?: {}
  ): Promise<number | null>;

  /**
   * Creates a document in a collection.
   * @param data - The document to create in the collection.
   * @param options - The options to apply to the query.
   * @returns {object | null}
   * @returns {Promise<object | null>}
   * @example await model.create({name:'Bes-js'});
   */
  create(data: Partial<ExtractSchemaType<T>>, options?: { $multi?: true }): Promise<ReturnCreateType>;

  /**
   * Deletes documents in a collection.
   * @param filter - The filter to apply to the collection.
   * @param options - The options to apply to the query.
   * @returns {object | number | null}
   * @returns {Promise<object | number | null>}
   * @example await model.delete({name:'Bes-js'},{ $multi: true });
   */
  delete(
    filter: Partial<ExtractSchemaType<T>> | Record<string, FindOperators>,
    options?: { $multi?: true }
  ): Promise<ExtractSchemaReturnType<T> & object & returnTypes | number | null>;

  /**
   * Updates documents in a collection.
   * @param filter - The filter to apply to the collection.
   * @param update - The update to apply to the documents.
   * @param options - The options to apply to the query.
   * @returns {object | null}
   * @returns {Promise<object | null>}
   * @example await model.update({name:'Bes-js'},{ $set:{name:'Bes-js'} },{ $multi: true });
   */
  update(
    filter: Partial<ExtractSchemaType<T>> | Record<string, FindOperators>,
    update: UpdateKeys,
    options?: { $multi?: true; $upsert?: boolean; $multiPull?: boolean }
  ): Promise<ExtractSchemaReturnType<T> & object & returnTypes | null>;

  /**
   * Retrieves information about the schema.
   * @returns An object containing information about the schema.
   * @returns {Promise<object>}
   */
  schemaInfo(): Promise<object>;

  /**
   * Drops the collection.
   * @returns {undefined}
   * @returns {Promise<undefined>}
   */
  dropCollection(): Promise<undefined>;

  /**
   * Renames the collection.
   * @param newCollectionName - The new name for the collection.
   * @returns {true | Error}
   * @returns {Promise<true | Error>}
   */
  renameCollection(newCollectionName: string): Promise<true | Error>;

  /**
   * renames a column in the collection.
   * @param oldColumnName - The old name of the column.
   * @param newColumnName - The new name of the column.
   * @returns {true | Error}
   * @returns {Promise<true | Error>}
   * @example await model.renameColumn('name','name1');
   */
  renameColumn(oldColumnName: string, newColumnName: string): Promise<true | Error>;

  /**
   * deletes a column in the collection.
   * @param columnName - The name of the column to delete.
   * @returns {true | Error}
   * @returns {Promise<true | Error>}
   * @example await model.deleteColumn('name');
   */
  deleteColumn(columnName: string): Promise<true | Error>;

  /**
   * all rows in the collection.
   * @param options - The options to apply to the query.
   * @returns {object[] | []}
   * @returns {Promise<object[] | []>}
   * @example await model.allRows({ $limit: 10, $skip: 0, $sort: 1 });
   */
  allRows(options?: { $limit?: number; $skip?: number; $sort?: -1 | 1 }): Promise<(ExtractSchemaReturnType<T> & object & returnTypes)[] | []>;
}

export { Model, Schema };
