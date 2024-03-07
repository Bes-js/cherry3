"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { db } = require('./index');
const dataModel = require('sequelize');
const Cherry3Error = require('./errorHandler');
/*const Events = require('./events');*/
const { set } = require('lodash');
const _ = require('lodash');

module.exports = class Model {
    constructor(collection, schema = {}, schemaOptions = { $timestamps: false, $alter: true }) {
        this.collection = collection;
        this.schema = schema;
        this.schemaOptions = schemaOptions;
        this.model = null;
        this.db = db;
        if (!this.db) throw new Cherry3Error("Database connection is required", "error");
    }

    async find(filter = {}, options = {}) {
        var ex = await this.#exec();
        if (filter.id) return await this.findById(filter.id, options);
        return ex.find(filter, options);
    }

    async findOne(filter = {}, options = {}) {
        var ex = await this.#exec();
        if (filter.id) return await this.findById(filter.id, options);
        return ex.findOne(filter, options);
    }

    async findOneAndUpdate(filter = {}, update = {}, options = {}) {
        var ex = await this.#exec();
        if (filter.id) return await this.findByIdAndUpdate(filter.id, update, options);
        return ex.findOneAndUpdate(filter, update, options);
    }

    async findOneAndDelete(filter = {}, options = {}) {
        var ex = await this.#exec();
        if (filter.id) return await this.findByIdAndDelete(filter.id, options);
        return ex.findOneAndDelete(filter, options);
    }

    async findById(id, options = {}) {
        var ex = await this.#exec();
        return ex.findById(id, options);
    }

    async findByIdAndUpdate(id, update = {}, options = {}) {
        var ex = await this.#exec();
        return ex.findByIdAndUpdate(id, update, options);
    }

    async findByIdAndDelete(id, options = {}) {
        var ex = await this.#exec();
        return ex.findByIdAndDelete(id, options);
    }

    async insertOne(data, options = {}) {
        var ex = await this.#exec();
        return ex.insertOne(data, options);
    }

    async insertMany(data) {
        var ex = await this.#exec();
        return ex.insertMany(data);
    }

    async updateOne(filter = {}, update = {}, options = {}) {
        var ex = await this.#exec();
        if (filter.id) return await this.findByIdAndUpdate(filter.id, update, options);
        return ex.updateOne(filter, update, options);
    }

    async updateMany(filter = {}, update = {}, options = {}) {
        var ex = await this.#exec();
        return ex.updateMany(filter, update, options);
    }

    async deleteOne(filter = {}, options = {}) {
        var ex = await this.#exec();
        if (filter.id) return await this.findByIdAndDelete(filter.id, options);
        return ex.deleteOne(filter, options);
    }

    async deleteMany(filter = {}, options = {}) {
        var ex = await this.#exec();
        return ex.deleteMany(filter, options);
    }

    async create(data, options = {}) {
        await this.#exec();
        var mod = await this.model.create(data, {});
        return mod;
    }

    async update(filter, update = {}, options = {}) {
        var ex = await this.#exec();
        return ex.update(filter, update, options);
    }

    async schemaInfo() {
        var ex = await this.#exec();
        return ex.schemaInfo();
    }

    async dropCollection() {
        var ex = await this.#exec();
        return ex.dropCollection();
    }

    async renameColumn(oldName, newName) {
        var ex = await this.#exec();
        return ex.renameColumn(oldName, newName);
    }

    async deleteColumn(columnName) {
        var ex = await this.#exec();
        return ex.deleteColumn(columnName);
    }

    async allRows(options = {}) {
        var ex = await this.#exec();
        return ex.allRows(options);
    }


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
            sequelize: db,
            modelName: collection,
            tableName: collection,
            timestamps: typeof this.schemaOptions?.$timestamps == "boolean" ? this.schemaOptions?.$timestamps : false,
        });
        await dataModelSchema.sync({ alter: this.schemaOptions?.$alter == false ? false : true });
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
        if (Object.keys(update).length == 0) throw new Cherry3Error("Update object is required", "warn");

        const operators = {
            $set: true,
            $unset: true,
            $inc: true,
            $dec: true,
            $push: true,
            $pull: true,
            $pullAll: true,
            $pushAll: true,
            $pop: true,
        };


        var databaseDataValue = await this.model.findOne({ where: { id } });
        if (options.$upsert == true && !databaseDataValue) {
            var newObj = {};

            Object.keys(update).forEach(async (key) => {
                var newValues = update[key];
                newObj = { ...newValues };
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

                            if (key == "$pullAll") {
                                var data = await this.model.findOne({ where: { id } });
                                if (!data) return;
                                if (!JSON.stringify(update[key][field]).startsWith("[") && !JSON.stringify(update[key][field]).endsWith("]")) throw new Cherry3Error(`Field '${field}' must be an array`, "error");
                                var arr = [...data.dataValues[field]];
                                var updateKey = [...update[key][field]];
                                if (!Array.isArray(arr)) return;
                                await data.update({ [field]: arr.filter((value) => !updateKey.includes(value)) });
                            }
                            if (key == "$pushAll") {
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
                                    var newValue = set(data.dataValues, field, null);
                                    if (!newValue) continue;
                                    var newField = field.split(".")[0];
                                    if (!newField) continue;
                                    var newObj = { ...newValue[newField] }
                                    await data.update({ [newField]: null });
                                    await data.update({ [newField]: newObj });
                                } else {
                                    await data.update({ [field]: null });
                                }
                            }
                        } catch (error) {
                            throw new Cherry3Error(error.message, "error");
                        }
                    }
                } else {
                    if (!(key in operators)) throw new Cherry3Error(`Operator '${key}' does not exist`, "error");
                    if (!schemaInfo[key]) throw new Cherry3Error(`Field '${key}' does not exist in collection '${collection}'`, "error");
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
        if (Object.keys(update).length == 0) throw new Cherry3Error("Update object is required", "warn");
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
            $pullAll: true,
            $pushAll: true,
            $pop: true,
        };
        var databaseDataValue = await this.model.findOne({ where: filter });
        if (options.$upsert == true && !databaseDataValue) {
            var newObj = {};
            Object.keys(update).forEach(async (key) => {
                var newValues = update[key];
                newObj = { ...filter, ...newValues };
            });
            await this.#create(collection, newObj, options = { $multi: options.$multi == true ? true : false });
        } else {
            for (var key of Object.keys(update)) {
                if (key in operators) {
                    for (var field of Object.keys(update[key])) {
                        if (!schemaInfo[field] && !field.includes(".")) throw new Cherry3Error(`Field '${field}' does not exist in collection '${collection}'`, "error");
                        try {
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
                                        await this.model.update({ [field]: update[key][field] }, { where: filter });
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
                            if (key == "$pullAll") {
                                if (options.$multi == true) {
                                    var dataValue = await this.model.findAll({ where: filter });
                                    if (!JSON.stringify(update[key][field]).startsWith("[") && !JSON.stringify(update[key][field]).endsWith("]")) throw new Cherry3Error(`Field '${field}' must be an array`, "error");
                                    dataValue.forEach(async (element) => {
                                        var arr = [...element.dataValues[field]];
                                        var updateKey = [...update[key][field]];
                                        if (!Array.isArray(arr)) return;
                                        await element.update({ [field]: arr.filter((value) => !updateKey.includes(value)) });
                                    });
                                } else {
                                    var data = await this.model.findOne({ where: filter });
                                    if (!data) return;
                                    if (!JSON.stringify(update[key][field]).startsWith("[") && !JSON.stringify(update[key][field]).endsWith("]")) throw new Cherry3Error(`Field '${field}' must be an array`, "error");
                                    var arr = [...data.dataValues[field]];
                                    var updateKey = [...update[key][field]];
                                    if (!Array.isArray(arr)) return;
                                    await data.update({ [field]: arr.filter((value) => !updateKey.includes(value)) });
                                }
                            }
                            if (key == "$pushAll") {
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
                                            var newValue = set(element.dataValues, field, null);
                                            if (!newValue) return;
                                            var newField = field.split(".")[0];
                                            if (!newField) return;
                                            var newObj = { ...newValue[newField] }
                                            await element.update({ [newField]: null });
                                            await element.update({ [newField]: newObj });
                                        } else {
                                            await element.update({ [field]: null });
                                        }
                                    });
                                } else {
                                    if (field.includes(".")) {
                                        var newValue = set(data.dataValues, field, null);
                                        if (!newValue) continue;
                                        var newField = field.split(".")[0];
                                        if (!newField) continue;
                                        var newObj = { ...newValue[newField] }
                                        await data.update({ [newField]: null });
                                        await data.update({ [newField]: newObj });
                                    } else {
                                        await data.update({ [field]: null });
                                    }
                                }
                            }
                        } catch (error) {
                            throw new Cherry3Error(error.message, "error");
                        }
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
                if (!schemaInfo[key]) throw new Cherry3Error(`Field '${key}' does not exist in collection '${collection}'`, "error");
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
                    type: dataModel.DataTypes.STRING,
                    allowNull: requiredValue == true ? false : true,
                    defaultValue: schema[key]?.default || ""
                };
            }
            if (schemaValue?.toString()?.includes("Float")) {
                newSchema[key] = {
                    type: dataModel.DataTypes.REAL,
                    allowNull: requiredValue == true ? false : true,
                    defaultValue: schema[key]?.default || 0.0
                };
            }
            if (schemaValue?.toString()?.includes("Number")) {
                newSchema[key] = {
                    type: dataModel.DataTypes.NUMBER,
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


}
