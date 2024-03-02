import { Knex } from 'knex';
import Model from './src/model';

    declare const db: Knex<any, unknown>;

    declare const Types: {
        Number: "number",
        Float: "float",
        Text: "text",
        Date: "date",
        String: "string",
        Boolean: "boolean",
        Array: "array",
    };

    declare function Schema(values: Record<any, {type?:string,default?:any,required?:boolean}>|Record<any,any>): Record<any, {type?:string,default?:any,required?:boolean}>|Record<any,any>;
    declare function DatabaseInformation():{fileSize:string, lastModified:string, createdAt:string, uid:number} | null;

    export { 
    db as Driver,
    Model,
    Schema,
    DatabaseInformation,
    Types
    };
