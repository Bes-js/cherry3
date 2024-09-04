"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { db, filePath } = require('./index');
const dataModel = require('sequelize');
const Cherry3Error = require('./errorHandler');
const Cherry3Debug = require('./debugHandler');
/*const Events = require('./events');*/
const { set, unset } = require('lodash');
const _ = require('lodash');



module.exports = class Model {
    constructor(collection, schema = {}, schemaOptions = { 
        $timestamps: false, 
        $debug: false
    }) {
        this.collection = collection;
        this.schema = schema;
        this.schemaOptions = schemaOptions;
        this.model = null;
        this.db = db;
        if (!this.db) throw new Cherry3Error("Database connection is required", "error");
    }

    async find(filter = {}, options = {}) {
        var ex = await this.#exec();
        if(this.schemaOptions.$debug == true) Cherry3Debug.sendLogMessage(`Find method called with filter: ${JSON.stringify(filter)} and options: ${JSON.stringify(options)}`);
        if (filter.id) return await this.findById(filter.id, options);
        return ex.find(filter, options);
    };

    async findOne(filter = {}, options = {}) {
        var ex = await this.#exec();
        if(this.schemaOptions.$debug == true) Cherry3Debug.sendLogMessage(`FindOne method called with filter: ${JSON.stringify(filter)} and options: ${JSON.stringify(options)}`);
        if (filter.id) return await this.findById(filter.id, options);
        return ex.findOne(filter, options);
    };

    async findOneAndUpdate(filter = {}, update = {}, options = {}) {
        var ex = await this.#exec();
        if (this.schemaOptions.$debug == true) Cherry3Debug.sendLogMessage(`FindOneAndUpdate method called with filter: ${JSON.stringify(filter)}, update: ${JSON.stringify(update)} and options: ${JSON.stringify(options)}`);
        if (filter.id) return await this.findByIdAndUpdate(filter.id, update, options);
        return ex.findOneAndUpdate(filter, update, options);
    };

    async findOneAndDelete(filter = {}, options = {}) {
        var ex = await this.#exec();
        if (this.schemaOptions.$debug == true) Cherry3Debug.sendLogMessage(`FindOneAndDelete method called with filter: ${JSON.stringify(filter)} and options: ${JSON.stringify(options)}`);
        if (filter.id) return await this.findByIdAndDelete(filter.id, options);
        return ex.findOneAndDelete(filter, options);
    };

    async findById(id, options = {}) {
        var ex = await this.#exec();
        if(this.schemaOptions.$debug == true) Cherry3Debug.sendLogMessage(`FindById method called with id: ${id} and options: ${JSON.stringify(options)}`);
        return ex.findById(id, options);
    };

    async findByIdAndUpdate(id, update = {}, options = {}) {
        var ex = await this.#exec();
        if(this.schemaOptions.$debug == true) Cherry3Debug.sendLogMessage(`FindByIdAndUpdate method called with id: ${id}, update: ${JSON.stringify(update)} and options: ${JSON.stringify(options)}`);
        return ex.findByIdAndUpdate(id, update, options);
    };

    async findByIdAndDelete(id, options = {}) {
        var ex = await this.#exec();
        if(this.schemaOptions.$debug == true) Cherry3Debug.sendLogMessage(`FindByIdAndDelete method called with id: ${id} and options: ${JSON.stringify(options)}`);
        return ex.findByIdAndDelete(id, options);
    };

    async insertOne(data, options = {}) {
        var ex = await this.#exec();
        if(this.schemaOptions.$debug == true) Cherry3Debug.sendLogMessage(`InsertOne method called with data: ${JSON.stringify(data)} and options: ${JSON.stringify(options)}`);
        return ex.insertOne(data, options);
    };

    async insertMany(data) {
        var ex = await this.#exec();
        if(this.schemaOptions.$debug == true) Cherry3Debug.sendLogMessage(`InsertMany method called with data: ${JSON.stringify(data)}`);
        return ex.insertMany(data);
    };

    async updateOne(filter = {}, update = {}, options = {}) {
        var ex = await this.#exec();
        if (this.schemaOptions.$debug == true) Cherry3Debug.sendLogMessage(`UpdateOne method called with filter: ${JSON.stringify(filter)}, update: ${JSON.stringify(update)} and options: ${JSON.stringify(options)}`);
        if (filter.id) return await this.findByIdAndUpdate(filter.id, update, options);
        return ex.updateOne(filter, update, options);
    };

    async updateMany(filter = {}, update = {}, options = {}) {
        var ex = await this.#exec();
        if (this.schemaOptions.$debug == true) Cherry3Debug.sendLogMessage(`UpdateMany method called with filter: ${JSON.stringify(filter)}, update: ${JSON.stringify(update)} and options: ${JSON.stringify(options)}`);
        return ex.updateMany(filter, update, options);
    };

    async deleteOne(filter = {}, options = {}) {
        var ex = await this.#exec();
        if (this.schemaOptions.$debug == true) Cherry3Debug.sendLogMessage(`DeleteOne method called with filter: ${JSON.stringify(filter)} and options: ${JSON.stringify(options)}`);
        if (filter.id) return await this.findByIdAndDelete(filter.id, options);
        return ex.deleteOne(filter, options);
    };

    async deleteMany(filter = {}, options = {}) {
        var ex = await this.#exec();
        if (this.schemaOptions.$debug == true) Cherry3Debug.sendLogMessage(`DeleteMany method called with filter: ${JSON.stringify(filter)} and options: ${JSON.stringify(options)}`);
        return ex.deleteMany(filter, options);
    };

    async create(data, options = {}) {
        await this.#exec();
        if (this.schemaOptions.$debug == true) Cherry3Debug.sendLogMessage(`Create method called with data: ${JSON.stringify(data)} and options: ${JSON.stringify(options)}`);
        var mod = await this.model.create(data, {});
        return mod?.dataValues || null;
    };

    async update(filter, update = {}, options = {}) {
        var ex = await this.#exec();
        if (this.schemaOptions.$debug == true) Cherry3Debug.sendLogMessage(`Update method called with filter: ${JSON.stringify(filter)}, update: ${JSON.stringify(update)} and options: ${JSON.stringify(options)}`);
        return ex.update(filter, update, options);
    };

    async schemaInfo() {
        var ex = await this.#exec();
        if (this.schemaOptions.$debug == true) Cherry3Debug.sendLogMessage(`SchemaInfo method called`);
        return ex.schemaInfo();
    };

    async dropCollection() {
        var ex = await this.#exec();
        if (this.schemaOptions.$debug == true) Cherry3Debug.sendLogMessage(`DropCollection method called`);
        return ex.dropCollection();
    };

    async renameColumn(oldName, newName) {
        var ex = await this.#exec();
        if (this.schemaOptions.$debug == true) Cherry3Debug.sendLogMessage(`RenameColumn method called with oldName: ${oldName} and newName: ${newName}`);
        return ex.renameColumn(oldName, newName);
    };

    async deleteColumn(columnName) {
        var ex = await this.#exec();
        if (this.schemaOptions.$debug == true) Cherry3Debug.sendLogMessage(`DeleteColumn method called with columnName: ${columnName}`);
        return ex.deleteColumn(columnName);
    };

    async allRows(options = {}) {
        var ex = await this.#exec();
        if (this.schemaOptions.$debug == true) Cherry3Debug.sendLogMessage(`AllRows method called with options: ${JSON.stringify(options)}`);
        return ex.allRows(options);
    };

    async distinct(field,group = false) {
        var ex = await this.#exec();
        if (this.schemaOptions.$debug == true) Cherry3Debug.sendLogMessage(`Distinct method called with field: ${field} and group: ${group}`);
        return ex.distinct(field, group);
    };

    async aggregate(pipeline) {
    var ex = await this.#exec();
    if (this.schemaOptions.$debug == true) Cherry3Debug.sendLogMessage(`Aggregate method called with pipeline: ${JSON.stringify(pipeline)}`);
    return ex.aggregate(pipeline);
    };

    async inspect() {
        var ex = await this.#exec();
        if (this.schemaOptions.$debug == true) Cherry3Debug.sendLogMessage(`Inspect method called`);
        return ex.inspect();
    };

    async countDocuments(filter = {}) {
        var ex = await this.#exec();
        if (this.schemaOptions.$debug == true) Cherry3Debug.sendLogMessage(`CountDocuments method called with filter: ${JSON.stringify(filter)}`);
        return ex.countDocuments(filter);
    };

    async #exec() {
        var collection = this.collection;
        var schema = this.schema;

        if (!collection || typeof collection !== "string" || collection == "") throw new Cherry3Error("Collection name is required", "error");
        if (!schema) throw new Cherry3Error("Schema is required", "error");
        if (typeof schema !== "object") throw new Cherry3Error("Schema must be an object", "error");
        if (schema == {}) throw new Cherry3Error("Schema must not be empty", "error");
        if (schema?.id) throw new Cherry3Error("Field 'id' is reserved", "error");

        class dataModelSchema extends dataModel.Model { };
        var newSchema = this.#convertSchema(schema);
        dataModelSchema.init(newSchema, {
            freezeTableName: true,
            sequelize: db,
            modelName: collection,
            tableName: collection,
            timestamps: typeof this.schemaOptions?.$timestamps == "boolean" ? this.schemaOptions?.$timestamps : false,
        });
        await dataModelSchema.sync();
        var queryInterface = db.getQueryInterface();
        await queryInterface.describeTable(collection).then((table) => {
            var tableFields = Object.keys(table);
            var schemaFields = Object.keys(newSchema);
            schemaFields.filter(x => !tableFields.includes(x)).forEach(async (field) => {
                await queryInterface.addColumn(collection, field, newSchema[field]);
                //Events.emit('columnAdded', field, schema[field]);
            });
        });
        this.model = dataModelSchema;

        return {
            inspect: async () => await this.#inspect(collection),
            countDocuments: async (filter = {}) => await this.#countDocuments(collection, filter),
            aggregate: async (pipeline) => await this.#aggregate(pipeline),
            distinct: async (field, group = false) => await this.#distinct(collection, field, group),
            find: async (filter = {}, options = {}) => await this.#find(collection, filter, { $multi: true, ...options }),
            findOne: async (filter = {}, options = {}) => await this.#find(collection, filter, { ...options, $multi: false }),
            findOneAndUpdate: async (filter = {}, update = {}, options = {}) => await this.#update(collection, filter, update, { ...options, $multi: false }),
            findOneAndDelete: async (filter = {}, options = {}) => await this.#delete(collection, filter, { ...options, $multi: false }),
            findById: async (id, options = {}) => await this.#findById(collection, id, { ...options, $multi: false }),
            findByIdAndUpdate: async (id, update = {}, options = {}) => await this.#findByIdAndUpdate(collection, id, update, { ...options }),
            findByIdAndDelete: async (id, options = {}) => await this.#findByIDAndDelete(collection, id, { ...options, $multi: false }),
            insertOne: async (data, options = {}) => await this.#create(collection, data, { ...options, $multi: false }),
            insertMany: async (data) => await this.#create(collection, data, { $multi: true }),
            updateOne: async (filter = {}, update = {}, options = {}) => await this.#update(collection, filter, update, { ...options, $multi: false }),
            updateMany: async (filter = {}, update = {}, options = {}) => await this.#update(collection, filter, update, { ...options, $multi: true }),
            deleteOne: async (filter = {}, options = {}) => await this.#delete(collection, filter, { ...options }),
            deleteMany: async (filter = {}, options = {}) => await this.#delete(collection, filter, { ...options, $multi: true }),
            create: async (data, options = {}) => await this.#create(collection, data, options = { ...options, $multi: false }),
            update: async (filter, update = {}, options = {}) => await this.#update(collection, filter, update, { ...options, $multi: true }),
            schemaInfo: () => this.schema,
            dropCollection: async () => await this.model.drop(),
            allRows: async (options = {}) => await this.#find(collection, {}, { $multi: true, ...options }),
            renameColumn: async (oldName, newName) => await this.#renameColumn(oldName, newName),
            deleteColumn: async (columnName) => await this.#deleteColumn(columnName),
        };
    }

    async #inspect(collection) {
        return collection;
    };

    async #countDocuments(collection, filter = {}) {
        if (!collection || typeof collection !== "string" || collection == "") throw new Cherry3Error("Collection name is required", "error");
        if (!filter) throw new Cherry3Error("Filter is required", "error");
        if (typeof filter !== "object") throw new Cherry3Error("Filter must be an object", "error");
        var data = await this.model.count({ where: filter });
        //Events.emit('count', data);
        return data;
    };

    async #aggregate(pipeline) {
    if (!pipeline) throw new Cherry3Error("Pipeline is required", "error");
    if (!Array.isArray(pipeline)) throw new Cherry3Error("Pipeline must be an array", "error");
    var convertedData = this.#aggregateConvert(pipeline);
    if(convertedData == null) throw new Cherry3Error("An Unknown Error Occurred While Converting the Pipeline", "error");
    if(convertedData?.attributes?.length == 0) delete convertedData.attributes;
    var data = await this.model.findAll(convertedData);
    //Events.emit('aggregate', data);
    if(!data || data.length == 0) return [];
    return data.map((element) => element.dataValues);
    };


    async #distinct(collection, field, group = false) {
        if (!field) throw new Cherry3Error("Field is required", "error");
        if (typeof field !== "string") throw new Cherry3Error("Field must be a string", "error");
        var schemaInfo = this.schema;
        if (!schemaInfo[field]) throw new Cherry3Error(`Field '${field}' does not exist in collection '${collection}'`, "error");
        var data = await this.model.findAll({ attributes: [field], group: group == true ? [field] : undefined });
        var values = data.map((element) => element.dataValues[field]);
        //Events.emit('distinct', values);
        return values;
    };

    async #renameColumn(oldName, newName) {
        if (!oldName) throw new Cherry3Error("Old name is required", "error");
        if (!newName) throw new Cherry3Error("New name is required", "error");
        if (typeof oldName !== "string") throw new Cherry3Error("Old name must be a string", "error");
        if (typeof newName !== "string") throw new Cherry3Error("New name must be a string", "error");
        if (oldName == newName) throw new Cherry3Error("Old name and new name must be different", "error");
        var queryInterface = db.getQueryInterface();
        queryInterface.renameColumn(this.collection, oldName, newName).then(() => {
            //Events.emit('columnRenamed', newName);
            return true;
        }).catch((error) => {
            throw new Cherry3Error(`An Unknown Error Occurred While Changing the Name of '${newName}', Check Your Code Structure.`, "error");
        });
    };


    async #deleteColumn(columnName) {
        if (!columnName) throw new Cherry3Error("Column name is required", "error");
        if (typeof columnName !== "string") throw new Cherry3Error("Column name must be a string", "error");
        var queryInterface = db.getQueryInterface();
        queryInterface.removeColumn(this.collection, columnName).then(() => {
            //Events.emit('columnDeleted', columnName);
            return true;
        }).catch((error) => {
            throw new Cherry3Error(`'${columnName}' Doesn't Already Exist`, "error");
        });
    };


    async #findByIDAndDelete(collection, id, options = {}) {
        if (!id) throw new Cherry3Error("Id is required", "error");
        if (isNaN(id)) throw new Cherry3Error("Id must be a number", "error");
        var data = await this.model.findOne({ where: { id } });
        //Events.emit('deleteOne', data?.dataValues || null);
        await data?.destroy();
        return data?.dataValues || null;
    };

    async #findById(collection, id, options = {}) {
        if (!id) throw new Cherry3Error("Id is required", "error");
        if (isNaN(id)) throw new Cherry3Error("Id must be a number", "error");
        var data = await this.model.findOne({ where: { id } });
        //Events.emit('findOne', data?.dataValues || null);
        return data?.dataValues || null;
    };

    async #findByIdAndUpdate(collection, id, update = {}, options = {}) {
        if (!id) throw new Cherry3Error("Id is required", "error");
        if (isNaN(id)) throw new Cherry3Error("Id must be a number", "error");
        if (!collection || typeof collection !== "string" || collection == "") throw new Cherry3Error("Collection name is required", "error");
        if (typeof update !== "object") throw new Cherry3Error("Update must be an object", "error");
        if (typeof options !== "object") throw new Cherry3Error("Options must be an object", "error");
        var schemaInfo = this.schema;
        //if (Object.keys(update).length == 0) throw new Cherry3Error("Update object is required", "warn");

        const operators = {
            $set: true,
            $unset: true,
            $inc: true,
            $dec: true,
            $push: true,
            $pull: true,
            $pop: true,
        };


        var databaseDataValue = await this.model.findOne({ where: { id } });
        if (options.$upsert == true && !databaseDataValue) {
            var newObj = {};

            Object.keys(update).forEach(async (key) => {
                var newValues = update[key];
                newObj = { ...newValues };
            });

            Object.keys(newObj).forEach(async (key) => {
            if (schemaInfo[key] == "Array" && !JSON.stringify(newObj[key]).startsWith("[") && !JSON.stringify(newObj[key]).endsWith("]")) newObj[key] = [newObj[key]];
            });

            await this.#create(collection, newObj, options = { $multi: options.$multi == true ? true : false });
        } else {

            for (var key of Object.keys(update)) {
                if (key in operators) {
                    for (var field of Object.keys(update[key])) {
                        if (!schemaInfo[field] && !field.includes(".")) throw new Cherry3Error(`Field '${field}' does not exist in collection '${collection}'`, "error");
                        try {
                            if (key == "$set") {
                                var data = await this.model.findOne({ where: { id } });
                                if (!data) return;
                                if (field.includes(".")) {
                                    if (schemaInfo[field.split(".")[0]] !== "Object") throw new Cherry3Error(`Field '${field.split(".")[0]}' must be an object`, "error");
                                    var newValue = set(data.dataValues, field, update[key][field]);
                                    if (!newValue) continue;
                                    var newField = field.split(".")[0];
                                    if (!newField) continue;
                                    var newObj = { ...newValue[newField] }
                                    await data.update({ [newField]: null });
                                    await data.update({ [newField]: newObj });
                                } else {
                                    var dataValue = update[key][field];
                                    if (schemaInfo[field] == "Array" && !JSON.stringify(update[key][field]).startsWith("[") && !JSON.stringify(update[key][field]).endsWith("]")) dataValue = [update[key][field]];
                                    await data.update({ [field]: dataValue });
                                }
                            }
                            if (key == "$inc") {
                                var data = await this.model.findOne({ where: { id } });
                                if (!data) return
                                if (field.includes(".")) {
                                    var newValue = _.update(data.dataValues, field, function (n) { return n ? n + update[key][field] : update[key][field]; });
                                    if (!newValue) continue;
                                    var newField = field.split(".")[0];
                                    if (!newField) continue;
                                    var newObj = { ...newValue[newField] }
                                    await data.update({ [newField]: null });
                                    await data.update({ [newField]: newObj });
                                } else {
                                    await data.increment({ [field]: update[key][field] });
                                }
                            }
                            if (key == "$dec") {
                                var data = await this.model.findOne({ where: { id } });
                                if (!data) return
                                if (field.includes(".")) {
                                    var newValue = _.update(data.dataValues, field, function (n) { return n ? n - update[key][field] : update[key][field]; });
                                    if (!newValue) continue;
                                    var newField = field.split(".")[0];
                                    if (!newField) continue;
                                    var newObj = { ...newValue[newField] }
                                    await data.update({ [newField]: null });
                                    await data.update({ [newField]: newObj });
                                } else {
                                    await data.increment({ [field]: -update[key][field] })
                                }
                            }

                            if (key == "$pop") {
                                var data = await this.model.findOne({ where: { id } });
                                if (!data) return
                                var arr = update[key][field] == -1 ? [...data.dataValues[field]].shift() : [...data.dataValues[field]].pop()
                                if (!Array.isArray(arr)) return;
                                await data.update({ [field]: arr });
                            }
                           /*
                            if (key == "$pull") {
                                var data = await this.model.findOne({ where: { id } });
                                if (!data) return
                                var newArr = [...data.dataValues[field]];
                                if (newArr.length == 0) return;
                                if (options.$multiPull == false) {
                                    newArr = this.#pull(newArr, update[key][field])
                                } else {
                                    newArr = newArr.filter((value) => JSON.stringify(value) !== JSON.stringify(update[key][field]));
                                }
                                if (!Array.isArray(newArr)) return;
                                await data.update({ [field]: newArr });
                            }
                            if (key == "$push") {
                                var data = await this.model.findOne({ where: { id } });
                                if (!data) return
                                var newArr = [...data.dataValues[field]]
                                var parsedValue = JSON.parse(JSON.stringify(update[key][field]))
                                newArr.push(parsedValue);
                                if (!Array.isArray(newArr)) return;
                                await data.update({ [field]: newArr });
                            }
                           */
                            if (key == "$pull") {
                                var data = await this.model.findOne({ where: { id } });
                                if (!data) return;
                                if(typeof update[key][field] == "function"){

                                    var index = data.dataValues[field].findIndex(update[key][field]);
                                    if(index == -1) return;

                                    var arr = [...data.dataValues[field]];
                                    var updateKey = data.dataValues[field].splice(index,1);
                                    if(!Array.isArray(arr)) return;
                                    if(!Array.isArray(updateKey)) return;

                                    await data.update({ [field]: [] });
                                    await data.update({ [field]: arr.filter((value) => !updateKey.includes(value)) });
                                }else{
                                if (!JSON.stringify(update[key][field]).startsWith("[") && !JSON.stringify(update[key][field]).endsWith("]")) throw new Cherry3Error(`Field '${field}' must be an array or function`, "error");
                                var arr = [...data.dataValues[field]];
                                var updateKey = [...update[key][field]];
                                if (!Array.isArray(arr)) return;
                                await data.update({ [field]: [] });
                                await data.update({ [field]: arr.filter((value) => !updateKey.includes(value)) });
                                }
                            }
                            if (key == "$push") {
                                var data = await this.model.findOne({ where: { id } });
                                if (!data) return;
                                if (!JSON.stringify(update[key][field]).startsWith("[") && !JSON.stringify(update[key][field]).endsWith("]")) throw new Cherry3Error(`Field '${field}' must be an array`, "error");
                                var arr = [...data.dataValues[field]];
                                if (!Array.isArray(arr)) return;
                                await data.update({ [field]: arr.concat(update[key][field]) });
                            }
                            if (key == "$unset") {
                                var data = await this.model.findOne({ where: { id } });
                                if (!data) return;
                                if (field.includes(".")) {
                                    var dataTitleObjectName = field.split(".")[0];
                                        
                                    var newValue = unset(data.dataValues[dataTitleObjectName], field.split(".").slice(1).join("."));
                                    if (!newValue) continue;
                                    var newField = field.split(".")[0];
                                    if (!newField) continue;
                                    var newObj = data.dataValues[dataTitleObjectName];
                                    await data.update({ [newField]: null });
                                    await data.update({ [newField]: newObj });
                                } else {
                                    await data.update({ [field]: {} });
                                }
                            }
                        } catch (error) {
                            throw new Cherry3Error(error.message, "error");
                        }
                    }
                } else {
                    if (!(key in operators)) throw new Cherry3Error(`Operator '${key}' does not exist`, "error");
                    if (!schemaInfo[key] && !key.includes('.')) throw new Cherry3Error(`Field '${key}' does not exist in collection '${collection}'`, "error");
                }
            }

            var data = await this.model.findOne({ where: { id } });
            //Events.emit('updateOne', data?.dataValues || null);
            return data?.dataValues || null;
        }
    };



    async #find(collection, filter = {}, options = { $multi: true }) {
        if (!collection || typeof collection !== "string" || collection == "") throw new Cherry3Error("Collection name is required", "error");
        if (!filter) throw new Cherry3Error("Filter is required", "error");
        if (typeof filter !== "object") throw new Cherry3Error("Filter must be an object", "error");
        if (typeof options !== "object") throw new Cherry3Error("Options must be an object", "error");
        var schemaInfo = this.schema;
        var keys = Object.keys(filter);
        keys.forEach((key) => {
            if (!schemaInfo[key]) throw new Cherry3Error(`Field '${key}' does not exist in collection '${collection}'`, "error");
        });

        if (options.$multi) {
            if (options.$limit && isNaN(options.$limit)) throw new Cherry3Error("Limit must be a number", "warn");
            if (options.$limit && options.$limit < 1) throw new Cherry3Error("Limit must be greater than 0", "warn");
            if (options.$skip && isNaN(options.$skip)) throw new Cherry3Error("Skip must be a number", "warn");
            if (options.$skip && options.$skip < 0) throw new Cherry3Error("Skip must be greater than or equal to 0", "warn");
            if (options.$limit && options.$skip && options.$limit < options.$skip) throw new Cherry3Error("Limit must be greater than or equal to skip", "warn");
            if (options.$sort && typeof options.$sort !== "object") throw new Cherry3Error("Sort must be an object", "warn");
            var data = await this.model.findAll({ where: filter, limit: options.$limit || undefined, offset: options.$skip || undefined, order: options.$sort ? Object.keys(options.$sort).map((key) => [key, options.$sort[key] == -1 ? 'DESC' : 'ASC']) : undefined });
            //Events.emit('findMany', data.length == 0 ? [] : data?.map((element) => element.dataValues) || []);
            if (data.length == 0) return [];
            return data.map((element) => element.dataValues);
        } else {
            var data = await this.model.findOne({ where: filter });
            //Events.emit('findOne', data?.dataValues || null);
            if (!data) return null;
            return data?.dataValues;
        }
    };


    async #update(collection, filter = {}, update = {}, options = {}) {
        if (!collection || typeof collection !== "string" || collection == "") throw new Cherry3Error("Collection name is required", "error");
        if (!filter) throw new Cherry3Error("Filter is required", "error");
        if (typeof filter !== "object") throw new Cherry3Error("Filter must be an object", "error");
        if (typeof update !== "object") throw new Cherry3Error("Update must be an object", "error");
        if (typeof options !== "object") throw new Cherry3Error("Options must be an object", "error");
        var schemaInfo = this.schema;
        //if (Object.keys(update).length == 0) throw new Cherry3Error("Update object is required", "warn");
        Object.keys(filter).forEach((key) => {
            if (!schemaInfo[key] && ![
                '$and',
                '$or',
            ].some(x => key == x)) throw new Cherry3Error(`Field '${key}' does not exist in collection '${collection}'`, "error");
        });

        const operators = {
            $set: true,
            $unset: true,
            $inc: true,
            $dec: true,
            $push: true,
            $pull: true,
            $pop: true,
        };
        var databaseDataValue = await this.model.findOne({ where: filter });
        if (options.$upsert == true && !databaseDataValue) {
            var newObj = {};
            Object.keys(update).forEach(async (key) => {
                var newValues = update[key];
                newObj = { ...filter, ...newValues };
            });

            Object.keys(newObj).forEach(async (key) => {
            if (schemaInfo[key] == "Array" && !JSON.stringify(newObj[key]).startsWith("[") && !JSON.stringify(newObj[key]).endsWith("]")) newObj[key] = [newObj[key]];
            });

            await this.#create(collection, newObj, options = { $multi: options.$multi == true ? true : false });
        } else {
            for (var key of Object.keys(update)) {
                if (key in operators) {
                    for (var field of Object.keys(update[key])) {
                        if (!schemaInfo[field] && !field.includes(".")) throw new Cherry3Error(`Field '${field}' does not exist in collection '${collection}'`, "error");
                       // try {
                            if (key == "$set") {
                                if (options.$multi == true) {
                                    if (field.includes(".")) {
                                        var newValue = set(databaseDataValue.dataValues, field, update[key][field]);
                                        if (!newValue) continue;
                                        var newField = field.split(".")[0];
                                        if (!newField) continue;
                                        var newObj = { ...newValue };
                                        await this.model.update({ [newField]: null }, { where: filter });
                                        await this.model.update({ [newField]: newObj }, { where: filter });
                                    } else {
                                    var data = update[key][field];
                                    if (schemaInfo[field] == "Array" && !JSON.stringify(update[key][field]).startsWith("[") && !JSON.stringify(update[key][field]).endsWith("]")) data = [update[key][field]];
                                    await this.model.update({ [field]: data }, { where: filter });
                                    }
                                } else {
                                    var data = await this.model.findOne({ where: filter });
                                    if (!data) return
                                    if (field.includes(".")) {
                                        if (schemaInfo[field.split(".")[0]] !== "Object") throw new Cherry3Error(`Field '${field.split(".")[0]}' must be an object`, "error");
                                        var newValue = set(data.dataValues, field, update[key][field]);
                                        if (!newValue) continue;
                                        var newField = field.split(".")[0];
                                        if (!newField) continue;
                                        var newObj = { ...newValue[newField] }
                                        await data.update({ [newField]: null });
                                        await data.update({ [newField]: newObj });
                                    } else {
                                        await data.update({ [field]: update[key][field] });
                                    }
                                }
                            }
                            if (key == "$inc") {
                                if (options.$multi == true) {
                                    var dataValue = await this.model.findAll({ where: filter });
                                    dataValue.forEach(async (element) => {
                                        if (field.includes(".")) {
                                            var newValue = _.update(element.dataValues, field, function (n) { return n ? n + update[key][field] : update[key][field]; });
                                            if (!newValue) return;
                                            var newField = field.split(".")[0];
                                            if (!newField) return;
                                            var newObj = { ...newValue[newField] }
                                            await element.update({ [newField]: null });
                                            await element.update({ [newField]: newObj });
                                        } else {
                                            await element.increment({ [field]: update[key][field] });
                                        }
                                    });
                                } else {
                                    var data = await this.model.findOne({ where: filter });
                                    if (!data) return
                                    if (field.includes(".")) {
                                        var newValue = _.update(data.dataValues, field, function (n) { return n ? n + update[key][field] : update[key][field]; });
                                        if (!newValue) continue;
                                        var newField = field.split(".")[0];
                                        if (!newField) continue;
                                        var newObj = { ...newValue[newField] }
                                        await data.update({ [newField]: null });
                                        await data.update({ [newField]: newObj });
                                    } else {
                                        await data.increment({ [field]: update[key][field] });
                                    }
                                }
                            }
                            if (key == "$dec") {
                                if (options.$multi == true) {
                                    var dataValue = await this.model.findAll({ where: filter });
                                    dataValue.forEach(async (element) => {
                                        if (field.includes(".")) {
                                            var newValue = _.update(element.dataValues, field, function (n) { return n ? n - update[key][field] : update[key][field]; });
                                            if (!newValue) return;
                                            var newField = field.split(".")[0];
                                            if (!newField) return;
                                            var newObj = { ...newValue[newField] }
                                            await element.update({ [newField]: null });
                                            await element.update({ [newField]: newObj });
                                        } else {
                                            await element.increment({ [field]: -update[key][field] });
                                        }
                                    });
                                } else {
                                    var data = await this.model.findOne({ where: filter });
                                    if (!data) return
                                    if (field.includes(".")) {
                                        var newValue = _.update(data.dataValues, field, function (n) { return n ? n - update[key][field] : update[key][field]; });
                                        if (!newValue) continue;
                                        var newField = field.split(".")[0];
                                        if (!newField) continue;
                                        var newObj = { ...newValue[newField] }
                                        await data.update({ [newField]: null });
                                        await data.update({ [newField]: newObj });
                                    } else {
                                        await data.increment({ [field]: -update[key][field] })
                                    }
                                }
                            }
                            if (key == "$pop") {
                                if (options.$multi == true) {
                                    var dataValue = await this.model.findAll({ where: filter });
                                    dataValue.forEach(async (element) => {
                                        var arr = update[key][field] == -1 ? [...element.dataValues[field]].shift() : [...element.dataValues[field]].pop()
                                        if (!Array.isArray(arr)) return;
                                        await element.update({ [field]: arr });
                                    });
                                } else {
                                    var data = await this.model.findOne({ where: filter });
                                    if (!data) return
                                    var arr = update[key][field] == -1 ? [...data.dataValues[field]].shift() : [...data.dataValues[field]].pop()
                                    if (!Array.isArray(arr)) return;
                                    await data.update({ [field]: arr });
                                }
                            }
                            /*
                            if (key == "$pull") {
                                if (options.$multi == true) {
                                    var dataValue = await this.model.findAll({ where: filter });
                                    dataValue.forEach(async (element) => {
                                        if (options.$multiPull == false) {
                                            var newArr = [...element.dataValues[field]];
                                            if (newArr.length == 0) return;
                                            newArr = this.#pull(newArr, update[key][field])
                                            if (!Array.isArray(newArr)) return;
                                            await element.update({ [field]: newArr });
                                        } else {
                                            var newArr = [...element.dataValues[field]];
                                            if (newArr.length == 0) return;
                                            newArr = newArr.filter((value) => JSON.stringify(value) !== JSON.stringify(update[key][field]));
                                            if (!Array.isArray(newArr)) return;
                                            await element.update({ [field]: newArr });
                                        }
                                    });
                                } else {
                                    var data = await this.model.findOne({ where: filter });
                                    if (!data) return
                                    var newArr = [...data.dataValues[field]];
                                    if (newArr.length == 0) return;
                                    if (options.$multiPull == false) {
                                        newArr = this.#pull(newArr, update[key][field])
                                    } else {
                                        newArr = newArr.filter((value) => JSON.stringify(value) !== JSON.stringify(update[key][field]));
                                    }
                                    if (!Array.isArray(newArr)) return;
                                    await data.update({ [field]: newArr });
                                }
                            }
                            if (key == "$push") {
                                if (options.$multi == true) {
                                    var dataValue = await this.model.findAll({ where: filter });
                                    dataValue.forEach(async (element) => {
                                        var newArr = [...element.dataValues[field]];
                                        newArr.push(JSON.parse(JSON.stringify(update[key][field])));
                                        if (!Array.isArray(newArr) && !newArr[0]) return;
                                        await element.update({ [field]: element.dataValues[field] });
                                    });
                                } else {
                                    var data = await this.model.findOne({ where: filter });
                                    if (!data) return
                                    var newArr = [...data.dataValues[field]]
                                    var parsedValue = JSON.parse(JSON.stringify(update[key][field]))
                                    newArr.push(parsedValue);
                                    if (!Array.isArray(newArr)) return;
                                    await data.update({ [field]: newArr });
                                }
                            }
                            */
                            
                            if (key == "$pull") {
                                if (options.$multi == true) {
                                    var dataValue = await this.model.findAll({ where: filter, raw: false });
                                    if(typeof update[key][field] == "function"){
                                        dataValue.forEach(async (data) => {
                                        var index = data.dataValues[field].findIndex(update[key][field]);
                                        if(index == -1) return;

                                        var arr = [...data.dataValues[field]];
                                        var updateKey = data.dataValues[field].splice(index,1);
                                        if(!Array.isArray(arr)) return;
                                        if(!Array.isArray(updateKey)) return;

                                        await data.update({ [field]: [] });
                                        await data.update({ [field]: arr.filter((value) => !updateKey.includes(value)) });
                                        });
                                    }else{

                                    if (!JSON.stringify(update[key][field])?.startsWith("[") && !JSON.stringify(update[key][field])?.endsWith("]")) throw new Cherry3Error(`Field '${field}' must be an array`, "error");
                                    dataValue.forEach(async (element) => {
                                        var arr = [...element.dataValues[field]];
                                        var updateKey = [...update[key][field]];
                                        if (!Array.isArray(arr)) return;
                                        await element.update({ [field]: arr.filter((value) => !updateKey.includes(value)) });
                                    });
                                   }
                                } else {
                                    var data = await this.model.findOne({ where: filter });
                                    if (!data) return;
                                    if(typeof update[key][field] == "function"){

                                        var index = data.dataValues[field].findIndex(update[key][field]);
                                        if(index == -1) return;

                                        var arr = [...data.dataValues[field]];
                                        var updateKey = data.dataValues[field].splice(index,1);
                                        if(!Array.isArray(arr)) return;
                                        if(!Array.isArray(updateKey)) return;

                                        await data.update({ [field]: [] });
                                        await data.update({ [field]: arr.filter((value) => !updateKey.includes(value)) });
                                    }else{
                                    if (!JSON.stringify(update[key][field]).startsWith("[") && !JSON.stringify(update[key][field]).endsWith("]")) throw new Cherry3Error(`Field '${field}' must be an array or function`, "error");
                                    var arr = [...data.dataValues[field]];
                                    var updateKey = [...update[key][field]];
                                    if (!Array.isArray(arr)) return;
                                    await data.update({ [field]: [] });
                                    await data.update({ [field]: arr.filter((value) => !updateKey.includes(value)) });
                                    }
                                }
                            }
                            if (key == "$push") {
                                if (options.$multi == true) {
                                    var dataValue = await this.model.findAll({ where: filter });
                                    if (!JSON.stringify(update[key][field]).startsWith("[") && !JSON.stringify(update[key][field]).endsWith("]")) throw new Cherry3Error(`Field '${field}' must be an array`, "error");
                                    dataValue.forEach(async (element) => {
                                        var arr = [...element.dataValues[field]];
                                        if (!Array.isArray(arr)) return;
                                        await element.update({ [field]: arr.concat(update[key][field]) });
                                    });
                                } else {
                                    var data = await this.model.findOne({ where: filter });
                                    if (!data) return;
                                    if (!JSON.stringify(update[key][field]).startsWith("[") && !JSON.stringify(update[key][field]).endsWith("]")) throw new Cherry3Error(`Field '${field}' must be an array`, "error");
                                    var arr = [...data.dataValues[field]];
                                    if (!Array.isArray(arr)) return;
                                    await data.update({ [field]: arr.concat(update[key][field]) });
                                }
                            }
                            
                            if (key == "$unset") {
                                if (options.$multi == true) {
                                    var dataValue = await this.model.findAll({ where: filter });
                                    dataValue.forEach(async (element) => {
                                        if (field.includes(".")) {
                                            var dataTitleObjectName = field.split(".")[0];
                                        
                                            var newValue = unset(element.dataValues[dataTitleObjectName], field.split(".").slice(1).join("."));
                                            if (!newValue) return;
                                            var newField = field.split(".")[0];
                                            if (!newField) return;
                                            var newObj = element.dataValues[dataTitleObjectName];
                                            await element.update({ [newField]: null });
                                            await element.update({ [newField]: newObj });
                                        } else {
                                            await element.update({ [field]: {} });
                                        }
                                    });
                                } else {
                                    if (field.includes(".")) {
                                        var data = await this.model.findOne({ where: filter });
                                        if (!data) return;
                                        var dataTitleObjectName = field.split(".")[0];
                                        
                                        var newValue = unset(data.dataValues[dataTitleObjectName], field.split(".").slice(1).join("."));
                                        if (!newValue) continue;
                                        var newField = field.split(".")[0];
                                        if (!newField) continue;
                                        var newObj = data.dataValues[dataTitleObjectName];
                                        await data.update({ [newField]: null });
                                        await data.update({ [newField]: newObj });
                                    } else {
                                        var data = await this.model.findOne({ where: filter });
                                        if (!data) return;
                                        await data.update({ [field]: {} });
                                    }
                                }
                            }
                        /*
                        } catch (error) {
                            throw new Cherry3Error(error.message, "error");
                        }
                            */
                    }
                } else {
                    if (!(key in operators)) throw new Cherry3Error(`Operator '${key}' does not exist`, "error");
                    if (!schemaInfo[key]) throw new Cherry3Error(`Field '${key}' does not exist in collection '${collection}'`, "error");
                }
            }

            if (options.$multi == true) {
                await this.model.sync();
                var data = await this.model.findAll({ where: filter });
                //Events.emit('updateMany', data?.map((element) => element.dataValues) || null);
                return data?.map((element) => element.dataValues) || null;
            } else {
                var data = await this.model.findOne({ where: filter });
                //Events.emit('updateOne', data?.dataValues || null);
                return data?.dataValues || null;
            }
        }
    }



    async #delete(collection, filter = {}, options = { $multi: true }) {
        if (!collection || typeof collection !== "string" || collection == "") throw new Cherry3Error("Collection name is required", "error");
        if (!filter) throw new Cherry3Error("Filter is required", "error");
        if (typeof filter !== "object") throw new Cherry3Error("Filter must be an object", "error");
        if (typeof options !== "object") throw new Cherry3Error("Options must be an object", "error");
        var schemaInfo = this.schema;
        Object.keys(filter).forEach((key) => {
            if (!schemaInfo[key]) throw new Cherry3Error(`Field '${key}' does not exist in collection '${collection}'`, "error")
        });
        if (options.$multi) {
            var data = await this.model.destroy({ where: filter });
            if(!data) return null;
            //Events.emit('deleteMany', data);
            return data || null;
        } else {
            var data = await this.model.findOne({ where: filter });
            if(!data) return null;
            //Events.emit('deleteOne', data?.dataValues || null);
            await data?.destroy();
            return data?.dataValues || null;
        }
    };

    async #create(collection, data = {}, options = {}) {
        if (!collection || typeof collection !== "string" || collection == "") throw new Cherry3Error("Collection name is required", "error");
        if (!data) throw new Cherry3Error("Data is required", "error");
        if (typeof data !== "object") throw new Cherry3Error("Data must be an object", "error");
        if (typeof options !== "object") throw new Cherry3Error("Options must be an object", "error");
        var schemaInfo = this.schema;
        if (options.$multi && !Array.isArray(data) && !data[0]) throw new Cherry3Error("Data must be an array", "error");
        if (!options.$multi) {
            Object.keys(data).forEach((key) => {
                if (!schemaInfo[key] && !key.includes('.')) throw new Cherry3Error(`Field '${key}' does not exist in collection '${collection}'`, "error");
            });
        }
        if (options.$multi == true) {
            var returnData = await this.model.bulkCreate(data);
            //Events.emit('insertMany', returnData?.map((element) => element.dataValues) || null);
            return returnData?.map((element) => element.dataValues) || null;
        } else {
            var returnData = await this.model.create(data);
            //Events.emit('insertOne', returnData?.dataValues || null);
            
            return returnData?.dataValues || null;
        }
    };




    #convertSchema(schema) {
        var newSchema = {};
        Object.keys(schema).forEach((key, index) => {
            var schemaValue = typeof schema[key] == "object" ? schema[key]?.type : schema[key];
            var requiredValue = schema[key]?.required;
            if (index == 0) {
                newSchema["id"] = {
                    type: dataModel.DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                };
            }
            if (schemaValue?.toString()?.includes("String")) {
                newSchema[key] = {
                    type: filePath()?.databaseType == "sqlite" ?  dataModel.DataTypes.STRING : dataModel.DataTypes.TEXT,
                    allowNull: requiredValue == true ? false : true,
                    defaultValue: schema[key]?.default || ""
                };
            }
            if (schemaValue?.toString()?.includes("Number")) {
                newSchema[key] = {
                    type: filePath()?.databaseType == "sqlite" ? dataModel.DataTypes.NUMBER : dataModel.DataTypes.FLOAT,
                    allowNull: requiredValue == true ? false : true,
                    defaultValue: schema[key]?.default || 0
                };
            }
            if (schemaValue?.toString()?.includes("Boolean")) {
                newSchema[key] = {
                    type: dataModel.DataTypes.BOOLEAN,
                    allowNull: requiredValue == true ? false : true,
                    defaultValue: schema[key]?.default || false
                };
            }
            if (schemaValue?.toString()?.includes("Array")) {
                newSchema[key] = {
                    type: dataModel.DataTypes.JSON,
                    allowNull: requiredValue == true ? false : true,
                    defaultValue: schema[key]?.default || []
                };
            }
            if (schemaValue?.toString()?.includes("Date")) {
                newSchema[key] = {
                    type: dataModel.DataTypes.DATE,
                    allowNull: requiredValue == true ? false : true,
                    defaultValue: schema[key]?.default || new Date()
                };
            }
            if (schemaValue?.toString()?.includes("Object")) {
                newSchema[key] = {
                    type: dataModel.DataTypes.JSON,
                    allowNull: requiredValue == true ? false : true,
                    defaultValue: schema[key]?.default || {}
                };
            }
        });
        return newSchema;
    }


    #ParseJSON(array) {
        if (!Array.isArray(array) && !array[0]) {
            var obj = {};
            Object.keys(array).forEach((key) => {
                if (String(array[key]).startsWith("{") && String(array[key]).endsWith("}")) {
                    obj[key] = JSON.parse(array[key]);
                } else {
                    obj[key] = array[key];
                }
            });
            return obj;
        } else {
            var arr = [];
            array.forEach((element) => {
                var obj = {};
                Object.keys(element).forEach((key) => {
                    obj[key] = JSON.parse(element[key]);
                })
                arr.push(obj);

            })
        }
    }

    #pull(arr, value) {
        const index = arr.findIndex(item => {
            if (typeof value === 'object' && typeof item === 'object') {
                return JSON.stringify(item) === JSON.stringify(value);
            } else {
                return item === value;
            }
        });
        if (index !== -1) {
            arr.splice(index, 1);
        }
        return arr;
    }



  #aggregateConvert(pipeline) {
    const query = {
        where: {},
        attributes: [],
        group: [],
        order: [],
        limit: null,
        offset: null
    };

    const applyOperator = (field, operator) => {
        switch (operator) {
            case '$eq': return { [dataModel.Op.eq]: field };
            case '$gt': return { [dataModel.Op.gt]: field };
            case '$gte': return { [dataModel.Op.gte]: field };
            case '$lt': return { [dataModel.Op.lt]: field };
            case '$lte': return { [dataModel.Op.lte]: field };
            case '$ne': return { [dataModel.Op.ne]: field };
            case '$in': 
            if (Array.isArray(field) && String(field).startsWith("[") && String(field).endsWith("]")) {
                return { [dataModel.Op.in]: field };
            } else {
                return { [dataModel.Op.in]: [field] };
            }
            case '$nin': 
            if (Array.isArray(field) && String(field).startsWith("[") && String(field).endsWith("]")) {
                return { [dataModel.Op.notIn]: field };
            } else {
                return { [dataModel.Op.notIn]: [field] };
            }
            case '$exists': return { [dataModel.Op.not]: field ? null : { [dataModel.Op.ne]: null } };
            case '$match': return { [dataModel.Op.match]: field };
            case '$or': return { [dataModel.Op.or]: field };
            case '$and': return { [dataModel.Op.and]: field };
            case '$notRegexp': return { [dataModel.Op.notRegexp]: field };
            case '$iRegexp': return { [dataModel.Op.iRegexp]: field };
            case '$notIRegexp': return { [dataModel.Op.notIRegexp]: field };
            case '$overlap': return { [dataModel.Op.overlap]: field };
            case '$adjacent': return { [dataModel.Op.adjacent]: field };
            case '$strictLeft': return { [dataModel.Op.strictLeft]: field };
            case '$strictRight': return { [dataModel.Op.strictRight]: field };
            case '$noExtendRight': return { [dataModel.Op.noExtendRight]: field };
            case '$noExtendLeft': return { [dataModel.Op.noExtendLeft]: field };
            case '$col': return { [dataModel.Op.col]: field };
            case '$substring': return { [dataModel.Op.substring]: field };
            case '$placeholder': return { [dataModel.Op.placeholder]: field };
            case '$regex': return { [dataModel.Op.regexp]: field };
            case '$all': return { [dataModel.Op.contains]: field };
            case '$startsWith': return { [dataModel.Op.startsWith]: field };
            case '$endsWith': return { [dataModel.Op.endsWith]: field };
            case '$like': return { [dataModel.Op.like]: field };
            case '$notLike': return { [dataModel.Op.notLike]: field };
            case '$iLike': return { [dataModel.Op.iLike]: field };
            case '$notILike': return { [dataModel.Op.notILike]: field };
            case '$overlap': return { [dataModel.Op.overlap]: field };
            case '$contains': return { [dataModel.Op.contains]: field };
            case '$contained': return { [dataModel.Op.contained]: field };
            case '$any': return { [dataModel.Op.any]: field };
            case '$between': return { [dataModel.Op.between]: field };
            case '$notBetween': return { [dataModel.Op.notBetween]: field };
            case '$is': return { [dataModel.Op.is]: field };
            case '$type':
                switch (field) {
                    case 'string': return { [dataModel.Op.is]: dataModel.DataTypes.STRING };
                    case 'number': return { [dataModel.Op.is]: dataModel.DataTypes.INTEGER };
                    case 'boolean': return { [dataModel.Op.is]: dataModel.DataTypes.BOOLEAN };
                    case 'date': return { [dataModel.Op.is]: dataModel.DataTypes.DATE };
                    case 'json': return { [dataModel.Op.is]: dataModel.DataTypes.JSON };
                    case 'object': return { [dataModel.Op.is]: dataModel.DataTypes.JSON };
                    case 'array': return { [dataModel.Op.is]: dataModel.DataTypes.JSON };
                    default: return field;
                };
            case '$col': return dataModel.Sequelize.col(field);
            case '$literal': return dataModel.Sequelize.literal(field);
            case '$fn': return dataModel.Sequelize.fn(field);
            case '$json': return dataModel.Sequelize.json(field);
            case '$cast': return dataModel.Sequelize.cast(field);
            case '$size': return dataModel.Sequelize.fn('JSONB_ARRAY_LENGTH', dataModel.Sequelize.col(field));
            case '$ceil': return dataModel.Sequelize.fn('CEIL', dataModel.Sequelize.col(field));
            case '$floor': return dataModel.Sequelize.fn('FLOOR', dataModel.Sequelize.col(field));
            case '$round': return dataModel.Sequelize.fn('ROUND', dataModel.Sequelize.col(field));
            case '$abs': return dataModel.Sequelize.fn('ABS', dataModel.Sequelize.col(field));
            case '$sqrt': return dataModel.Sequelize.fn('SQRT', dataModel.Sequelize.col(field));
            case '$log': return dataModel.Sequelize.fn('LOG', dataModel.Sequelize.col(field));
            case '$log2': return dataModel.Sequelize.fn('LOG2', dataModel.Sequelize.col(field));
            case '$log10': return dataModel.Sequelize.fn('LOG10', dataModel.Sequelize.col(field));
            case '$exp': return dataModel.Sequelize.fn('EXP', dataModel.Sequelize.col(field));
            case '$pow': return dataModel.Sequelize.fn('POW', dataModel.Sequelize.col(field));
            case '$acos': return dataModel.Sequelize.fn('ACOS', dataModel.Sequelize.col(field));
            case '$asin': return dataModel.Sequelize.fn('ASIN', dataModel.Sequelize.col(field));
            case '$atan': return dataModel.Sequelize.fn('ATAN', dataModel.Sequelize.col(field));
            case '$cos': return dataModel.Sequelize.fn('COS', dataModel.Sequelize.col(field));
            case '$cot': return dataModel.Sequelize.fn('COT', dataModel.Sequelize.col(field));
            case '$sin': return dataModel.Sequelize.fn('SIN', dataModel.Sequelize.col(field));
            case '$tan': return dataModel.Sequelize.fn('TAN', dataModel.Sequelize.col(field));
            case '$radians': return dataModel.Sequelize.fn('RADIANS', dataModel.Sequelize.col(field));
            case '$degrees': return dataModel.Sequelize.fn('DEGREES', dataModel.Sequelize.col(field));
            case '$random': return dataModel.Sequelize.fn('RANDOM', dataModel.Sequelize.col(field));
            default: return field;
        }
    };

    let facets = {};

    for (const stage of pipeline) {
        if (stage.$match) {
            for (const [key, value] of Object.entries(stage.$match)) {
                 if (typeof value == 'object' && String(value).includes('.')) {
                    for (const [op, opValue] of Object.entries(value)) {
                        if (!_.has(query.where, key)) _.set(query.where, key, {});
                        _.merge(_.get(query.where, key), applyOperator(opValue, op));
                    }
                } else {
                    _.set(query.where, key, value);
                }
            }
        } else if (stage.$group) {
            const groupBy = [];
            const groupAttrs = [];
            for (const [key, value] of Object.entries(stage.$group)) {
                if (key === 'id') {
                    query.group = value;
                    groupAttrs.push([dataModel.Sequelize.col(value), key]);
                } else {
                    if (typeof value === 'object' && value.$sum) {
                        groupBy.push([dataModel.Sequelize.fn('SUM', dataModel.Sequelize.col(value.$sum)), key]);
                    } else if (typeof value === 'object' && value.$avg) {
                        groupBy.push([dataModel.Sequelize.fn('AVG', dataModel.Sequelize.col(value.$avg)), key]);
                    } else if (typeof value === 'object' && value.$min) {
                        groupBy.push([dataModel.Sequelize.fn('MIN', dataModel.Sequelize.col(value.$min)), key]);
                    } else if (typeof value === 'object' && value.$max) {
                        groupBy.push([dataModel.Sequelize.fn('MAX', dataModel.Sequelize.col(value.$max)), key]);
                    } else if (typeof value === 'object' && value.$count) {
                        groupBy.push([dataModel.Sequelize.fn('COUNT', dataModel.Sequelize.col(value.$count)), key]);
                    } else {
                        groupBy.push([dataModel.Sequelize.col(value), key]);
                    }
                }
            }
            query.attributes = [...groupAttrs, ...groupBy];
        } else if (stage.$sort) {
            query.order = Object.entries(stage.$sort).map(([key, value]) => [key, value === 1 ? 'ASC' : 'DESC']);
        } else if (stage.$skip) {
            query.offset = stage.$skip;
        } else if (stage.$limit) {
            query.limit = stage.$limit;
        } else if (stage.$project) {
            query.attributes = Object.keys(stage.$project).filter(key => stage.$project[key]);
        } else if (stage.$facet) {
            facets = stage.$facet;
        } else if (stage.$unwind) {
            query.attributes.push([dataModel.Sequelize.literal(`JSON_ARRAY_ELEMENTS(${stage.$unwind})`), stage.$unwind]);
        } else if (stage.$addFields) {
            for (const [key, value] of Object.entries(stage.$addFields)) {
                query.attributes.push([dataModel.Sequelize.literal(`${typeof value == 'string' ? `'${value}'` : `${value}`}`), key]);
            }
        } else if (stage.$unset) {
            for (const field of stage.$unset) {
                query.attributes = query.attributes.filter(attr => attr[1] !== field);
            }
        } else if (stage.$set) {
            for (const [key, value] of Object.entries(stage.$set)) {
                query.attributes.push([dataModel.Sequelize.literal(`${typeof value == 'string' ? `'${value}'` : `${value}`}`), key]);
            }
        } else if (stage.$count) {
            query.attributes.push([dataModel.Sequelize.fn('COUNT', dataModel.Sequelize.col(stage.$count)), 'count']);
        } else if (stage.$search) {
            const searchField = Object.keys(stage.$search.text.path).join(', ');
            const searchTerm = stage.$search.text.query;
            query.where[searchField] = { [dataModel.Op.like]: `%${searchTerm}%` };
        }
    }

    var results = query;

    if (Object.keys(facets).length > 0) {
        const facetResults = {};
        for (const [facetKey, facetPipeline] of Object.entries(facets)) {
            facetResults[facetKey] = this.#aggregateConvert(facetPipeline);
        }
        results = facetResults;
    }

    return results;
}




}
