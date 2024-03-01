"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { db } = require('./index');


module.exports = class Model {
    constructor(collection, schema = {}, methods = {}) {
        this.collection = collection;
        this.schema = schema;
        this.methods = methods;
        this.db = db;
        if (!this.db) throw new Error("Database is required");
    }


     async exec() {
        var collection = this.collection;
        var schema = this.schema;
        var methods = this.methods;

        if (!collection || typeof collection !== "string" || collection == "") throw new Error("Collection name is required");
        if (!schema) throw new Error("Schema is required");
        if (typeof schema !== "object") throw new Error("Schema must be an object");

        if (!(await this.db.schema.hasTable(collection))) {
            await this.db.schema.createTable(collection, (table) => {
                Object.keys(schema).forEach((key, index) => {
                    var schemaType = typeof schema[key] == "object" ? schema[key]?.type : schema[key];
                    var defaultValue = typeof schema[key] == "object" ? schema[key]?.default : undefined;
                    if (index == 0) table.increments("id").unique().defaultTo(0).primary();
                    if (schemaType == "string") table.string(key).defaultTo(defaultValue);
                    if (schemaType == "number") table.integer(key).defaultTo(defaultValue);
                    if (schemaType == "date") table.date(key).defaultTo(defaultValue);
                    if (schemaType == "text") table.text(key).defaultTo(defaultValue);
                    if (schemaType == "float") table.float(key).defaultTo(defaultValue);
                    if (schemaType == "boolean") table.boolean(key).defaultTo(defaultValue);
                    if (schemaType == "array") table.jsonb(key).defaultTo(defaultValue);
                    if (schemaType == "object") table.jsonb(key).defaultTo(defaultValue);
                });
            });
        };
        new Promise((resolve, reject) => { resolve(setTimeout(() => 500)); });

        var collectionInfo = await this.db(collection).columnInfo();
        Object.keys(schema).forEach(async(key) => {
            if (!collectionInfo[key]) await this.db.schema.table(collection, (table) => {
                var schemaType = typeof schema[key] == "object" ? schema[key]?.type : schema[key];
                var defaultValue = typeof schema[key] == "object" ? schema[key]?.default : undefined;
                if (schemaType == "string") table.string(key).defaultTo(defaultValue);
                if (schemaType == "number") table.integer(key).defaultTo(defaultValue);
                if (schemaType == "date") table.date(key).defaultTo(defaultValue);
                if (schemaType == "text") table.text(key).defaultTo(defaultValue);
                if (schemaType == "float") table.float(key).defaultTo(defaultValue);
                if (schemaType == "boolean") table.boolean(key).defaultTo(defaultValue);
                if (schemaType == "array") table.jsonb(key).defaultTo(defaultValue);
                if (schemaType == "object") table.jsonb(key).defaultTo(defaultValue);
            });
        });



        return {
            find: async (filter = {}) => await this.#find(collection, filter, { multi: true }),
            findOne: async (filter = {}, options = {}) => await this.#find(collection, filter, { ...options, multi: false }),
            findOneAndUpdate: async (filter = {}, update = {}, options = {}) => await this.#update(collection, filter, update, { ...options }),
            findOneAndDelete: async (filter = {}, options = {}) => await this.#delete(collection, filter, { ...options, multi: false }),
            findById: async (id, options = {}) => await this.#find(collection, { id }, { ...options, multi: false }),
            findByIdAndUpdate: async (id, update = {}, options = {}) => await this.#update(collection, { id }, update, { ...options }),
            findByIdAndDelete: async (id, options = {}) => await this.#delete(collection, { id }, { ...options, multi: false }),
            insertOne: async (data, options = {}) => await this.#create(collection, data, { ...options, multi: false }),
            insertMany: async (data, options = {}) => await this.#create(collection, data, { ...options, multi: true }),
            updateOne: async (filter = {}, update = {}, options = {}) => await this.#update(collection, filter, update, { ...options }),
            updateMany: async (filter = {}, update = {}, options = {}) => await this.#update(collection, filter, update, { ...options, multi: true }),
            deleteOne: async (filter = {}, options = {}) => await this.#delete(collection, filter, { ...options }),
            deleteMany: async (filter = {}, options = {}) => await this.#delete(collection, filter, { ...options, multi: true }),
            create: async (data, options = {}) => await this.#create(collection, data, options = { ...options, multi: true }),
            save: async (data) => await this.#create(collection, data, { multi: true }),
            update: async (filter, update = {}, options = {}) => await this.#update(collection, filter, update, { ...options, multi: true }),
            schemaInfo: async () => await this.db(collection).columnInfo(),
            dropCollection: async () => await this.db.schema.dropTableIfExists(collection),
            allRows: async () => await this.#find(collection, {}, { multi: true }),
            ...methods,
        };
    }



    async #find(collection, filter = {}, options = { multi: true }) {
        if (!collection || typeof collection !== "string" || collection == "") throw new Error("Collection name is required");
        if (!filter) throw new Error("Filter is required");
        if (typeof filter !== "object") throw new Error("Filter must be an object");
        if (typeof options !== "object") throw new Error("Options must be an object");
        var schemaInfo = await this.db(collection).columnInfo();
        var keys = Object.keys(filter);
        keys.forEach((key) => {
            if (!schemaInfo[key]) throw new Error(`Field ${key} does not exist in collection ${collection}`);
        });

        if (options.multi) {
            return (await this.db(collection).where(filter)).map((data) => this.#formatReply(data));
        } else {
            return this.#formatReply((await this.db(collection).where(filter).first()));
        }
    };


    async #update(collection, filter = {}, update = {}, options = {}) {
        if (!collection || typeof collection !== "string" || collection == "") throw new Error("Collection name is required");
        if (!filter) throw new Error("Filter is required");
        if (typeof filter !== "object") throw new Error("Filter must be an object");
        if (typeof update !== "object") throw new Error("Update must be an object");
        if (typeof options !== "object") throw new Error("Options must be an object");
        var schemaInfo = await this.db(collection).columnInfo();
        if (Object.keys(update).length == 0) throw new Error("Update object is empty");
        Object.keys(filter).forEach((key) => {
            if (!schemaInfo[key]) throw new Error(`Field ${key} does not exist in collection ${collection}`);
        });

        const operators = {
            $set: true,
            $unset: true,
            $inc: true,
            $dec: true,
            $push: true,
            $pull: true
        };


        var databaseDataValue = await this.db(collection).where(filter).first();
        if (options.upsert == true && !databaseDataValue) {
            var newObj = {};

            Object.keys(update).forEach(async (key) => {
                var newValues = update[key];
                newObj = { ...filter, ...newValues };
            });

            await this.#create(collection, newObj);
            return newObj;
        } else {

            Object.keys(update).forEach(async (key) => {
                if (key in operators) {
                    Object.keys(update[key]).forEach(async (field) => {
                        if (!schemaInfo[field]) throw new Error(`Field ${field} does not exist in collection ${collection}`);
                        try {
                            if (key == "$set") {

                                if (options.multi == true) {
                                    var dataValue = await this.db(collection).where(filter);
                                    dataValue.forEach(async (element) => {
                                        await this.db(collection).where({ id: element.id }).update({ [field]: update[key][field] });
                                    });
                                } else {
                                    var data = await this.db(collection).where(filter).first();
                                    await this.db(collection).where({ id: data?.id }).update({ [field]: update[key][field] });
                                }

                            }
                            if (key == "$inc") {


                                if (options.multi == true) {

                                    var dataValue = await this.db(collection).where(filter);
                                    dataValue.forEach(async (element) => {
                                        let newIncValue = (await this.db(collection).where({ id: element.id }).first())[field] + update[key][field];
                                        await this.db(collection).where({ id: element.id }).update({ [field]: newIncValue });
                                    });

                                } else {
                                    let newIncValue = (await this.db(collection).where(filter).first())[field] + update[key][field];
                                    var data = await this.db(collection).where(filter).first();
                                    await this.db(collection).where({ id: data?.id }).update({ [field]: newIncValue });
                                }


                            }
                            if (key == "$dec") {

                                if (options.multi == true) {

                                    var dataValue = await this.db(collection).where(filter);
                                    dataValue.forEach(async (element) => {
                                        let newIncValue = (await this.db(collection).where({ id: element.id }).first())[field] - update[key][field];
                                        await this.db(collection).where({ id: element.id }).update({ [field]: newIncValue });
                                    });

                                } else {
                                    let newIncValue = (await this.db(collection).where(filter).first())[field] - update[key][field];
                                    var data = await this.db(collection).where(filter).first();
                                    await this.db(collection).where({ id: data?.id }).update({ [field]: newIncValue });
                                }
                            }
                            if (key == "$pull") {

                                if (options.multi == true) {
                                    var dataValue = await this.db(collection).where(filter);
                                    dataValue.forEach(async (element) => {
                                        var arr = JSON.parse(((await this.db(collection).where({ id: element.id }).first())[field]));
                                        var newArr = [];
                                        for (let i = 0; i < arr?.length; i++) {
                                            var element = arr[i];
                                            if (update[key][field].includes(element)) continue;
                                            newArr.push(element);
                                        }
                                        await this.db(collection).where({ id: element.id }).update({ [field]: JSON.stringify(newArr) });
                                    });
                                } else {
                                    var arr = JSON.parse(((await this.db(collection).where(filter).first())[field]));
                                    var newArr = [];
                                    for (let i = 0; i < arr?.length; i++) {
                                        var element = arr[i];
                                        if (update[key][field].includes(element)) continue;
                                        newArr.push(element);
                                    }
                                    var data = await this.db(collection).where(filter).first();
                                    await this.db(collection).where({ id: data?.id }).update({ [field]: JSON.stringify(newArr) });
                                }


                            }
                            if (key == "$push") {

                                if (options.multi == true) {
                                    var dataValue = await this.db(collection).where(filter);

                                    dataValue.forEach(async (element) => {
                                        var arr = JSON.parse(((await this.db(collection).where({ id: element.id }).first())[field]));
                                        arr?.push(...update[key][field]);
                                        await this.db(collection).where({ id: element.id }).update({ [field]: JSON.stringify(arr) });
                                    })

                                } else {

                                    var arr = JSON.parse(((await this.db(collection).where(filter).first())[field]));
                                    arr?.push(...update[key][field]);
                                    var data = await this.db(collection).where(filter).first();
                                    await this.db(collection).where({ id: data?.id }).update({ [field]: JSON.stringify(arr) });

                                }
                            }
                            if (key == "$unset") {

                                if (options.multi == true) {
                                    var dataValue = await this.db(collection).where(filter);
                                    dataValue.forEach(async (element) => {
                                        await this.db(collection).where({ id: element.id }).update({ [field]: null });
                                    });


                                } else {

                                    var data = await this.db(collection).where(filter).first();
                                    await this.db(collection).where({ id: data?.id }).update({ [field]: null });

                                }

                            }
                        } catch (error) {
                            throw new Error(error);
                        }
                    })
                } else {
                    if (!schemaInfo[key]) throw new Error(`Field ${key} does not exist in collection ${collection}`);
                }
            });


            if (options.new == true) {
                new Promise((resolve, reject) => { resolve(setTimeout(() => 500)); });
                return (await this.db(collection).where(filter).first() ? this.#formatReply((await this.db(collection).where(filter).first())) : null);
            } else {
                return null;
            }
        }
    }



    async #delete(collection, filter = {}, options = { multi: true }) {
        if (!collection || typeof collection !== "string" || collection == "") throw new Error("Collection name is required");
        if (!filter) throw new Error("Filter is required");
        if (typeof filter !== "object") throw new Error("Filter must be an object");
        if (typeof options !== "object") throw new Error("Options must be an object");
        var schemaInfo = await this.db(collection).columnInfo();
        Object.keys(filter).forEach((key) => {
            if (!schemaInfo[key]) throw new Error(`Field ${key} does not exist in collection ${collection}`);
        });
        if (options.multi) {
            var data = (await this.db(collection).where(filter));
            data.forEach(async (element) => {
                if (!element?.id) return;
                await this.db(collection).where({ id: element.id }).delete();
            });
            return null;
        } else {
            var data = (await this.db(collection).where(filter).first());
            if (!data?.id) return;
            await this.db(collection).where({ id: data.id }).delete();
            return null;
        }
    };

    async #create(collection, data = {}, options = { multi: true }) {
        if (!collection || typeof collection !== "string" || collection == "") throw new Error("Collection name is required");
        if (!data) throw new Error("Data is required");
        if (typeof data !== "object") throw new Error("Data must be an object");
        if (typeof options !== "object") throw new Error("Options must be an object");
        var schemaInfo = await this.db(collection).columnInfo();
        Object.keys(data).forEach((key) => {
            if (!schemaInfo[key]) throw new Error(`Field ${key} does not exist in collection ${collection}`);
        });
        if (options.multi) {
            return this.#formatReply((await this.db(collection).insert(this.#formatInsert(data))));
        } else {
            return this.#formatReply((await this.db(collection).insert(this.#formatInsert(data))));
        }
    };






    #formatReply(obj) {
        if(typeof obj !== "object" || Object.keys(obj).length == 0) return null;
        Object.keys(obj).forEach((key) => {
            if (obj[key]?.toString()?.startsWith("[") && obj[key]?.toString()?.endsWith("]")) {
                obj[key] = JSON.parse(obj[key]);
            }
        })
        return obj;
    }

    #formatInsert(obj) {
        if(typeof obj !== "object" || Object.keys(obj).length == 0) return null;
        Object.keys(obj).forEach((key) => {
            if (Array.isArray(obj[key])) {
                obj[key] = JSON.stringify(obj[key]);
            }
        })
        return obj;
    }





}