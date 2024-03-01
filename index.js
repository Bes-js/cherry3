"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const { db, DatabaseInformation } = require('./src/index');
const Model = require('./src/model');

const Types = {
    Number: "number",
    Float: "float",
    Text: "text",
    Date: "date",
    String: "string",
    Boolean: "boolean",
    Array: "array",
};


/**
 * Represents a schema for a database table.
 *
 * @param {Object} values - The schema values.
 * @returns {Object} - The validated schema object.
 * @throws {Error} - If the schema is not provided or is not an object, or if a type is missing.
 */
function Schema(values) {
    var types = ["number", "float", "text", "date", "string", "boolean", "array"];
    if (!values) throw new Error("Schema is required");
    if (typeof values !== "object") throw new Error("Schema must be an object");
    Object.keys(values).forEach((key) => {
        if (!types.some(type => values[key] == type || values[key]?.type == type)) throw new Error("Type is required");
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