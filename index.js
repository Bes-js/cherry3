"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const { db, DatabaseInformation } = require('./src/index');
const Model = require('./src/model');

const Types = {
    Number: "Number",
    Float: "Float",
    Date: "Date",
    String: "String",
    Boolean: "Boolean",
    Array: "Array",
    Object: "Object"
};


/**
 * Represents a schema for a database table.
 *
 * @param {Object} values - The schema values.
 * @returns {Object} - The validated schema object.
 * @throws {Error} - If the schema is not provided or is not an object, or if a type is missing.
 */
function Schema(values) {
    var types = ["Number", "Float", "Date", "String", "Boolean", "Array", "Object"];
    if (!values) throw new Error("Schema fields is required");
    if (typeof values !== "object") throw new Error("Schema must be an object");
    var obj = {};
    Object.keys(values).forEach((key) => {
    if (!types.some(type => values[key]?.toString()?.includes(type) || values[key]?.type?.toString()?.includes(type))) throw new Error("Type is required or invalid for '" + values[key] + "' in schema.");
    obj[key] = values[key];
    });
    return values;
}


module.exports = {
    Driver: db,
    Model,
    Types,
    Schema,
    DatabaseInformation
};
