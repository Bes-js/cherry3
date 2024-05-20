import { Sequelize, TextDataTypeConstructor } from 'sequelize';
import { Model, Schema } from './src/model';

    declare const db: Sequelize;

    /**
     * @type {{DeleteOne: string, DeleteMany: string, UpdateOne: string, UpdateMany: string, InsertOne: string, InsertMany: string, FindOne: string, Find: string, DatabaseConnected: string, DatabaseConnectionFailed: string, BackupCreated: string, UnexpectedError: string}}
     * @readonly
     * @enum {string}
    declare const EventsTypes: {
    DeleteOne: "deleteOne",
    DeleteMany: "deleteMany",
    UpdateOne: "updateOne",
    UpdateMany: "updateMany",
    InsertOne: "insertOne",
    InsertMany: "insertMany",
    FindOne: "findOne",
    Find: "find",
    DatabaseConnected: "databaseConnected",
    DatabaseConnectionFailed: "databaseConnectionFailed",
    BackupCreated: "backupCreated",
    UnexpectedError: "unexpectedError",
    };
    */


    
    /**
     * Represents the available types in the application.
     * @returns {Types}
     */
    declare const Types: {
        Number: NumberConstructor,
        Date: DateConstructor,
        String: StringConstructor,
        Boolean: BooleanConstructor,
        Array: ArrayConstructor,
        Object: ObjectConstructor,
    };

    
    /**
     * Represents a function that creates a schema object.
     * @param values - An object representing the schema values.
     * @returns A schema object.
     */
    /*
    declare function Schema(values: Record<any, {type?:string,default?:any,required?:boolean}>|Record<any,any>): Record<any, {type?:string,default?:any,required?:boolean}>|Record<any,any>;
    */

    
    /**
     * Retrieves information about the database.
     * @returns An object containing the following properties:
     * - fileSize: The size of the database file.
     * - lastModified: The date and time when the database was last modified.
     * - createdAt: The date and time when the database was created.
     * - uid: The unique identifier of the database.
     * If the information is not available, it returns null.
     */
    declare function DatabaseInformation():{fileSize:string, lastModified:string, createdAt:string, uid:number} | null;


    export {
    db as Driver,
    Model,
    Schema,
    DatabaseInformation,
    Types
    };
