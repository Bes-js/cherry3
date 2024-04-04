"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module index
 */

/**
 * Module dependencies.
 * @private
 */
const path = require('path');
const Cherry3Error = require('./errorHandler');
/*const Events = require('./events');*/
const fs = require('fs');
const process = require('process');
process.removeAllListeners('warning');

const { Sequelize, Op } = require('sequelize');

/**
 * Represents the database connection.
 * @type {Sequelize}
 */
const db = new Sequelize({
  dialect: 'sqlite',
  define: {
    freezeTableName: true,
  },
  storage: path.join(process.cwd(), filePath()),
  logging: false,
  host: 'localhost',
  operatorsAliases: {
    $eq: Op.eq,
    $gt: Op.gt,
    $gte: Op.gte,
    $lt: Op.lt,
    $lte: Op.lte,
    $ne: Op.ne,
    $nin: Op.notIn,
    $is: Op.is,
    $in: Op.in,
    $and: Op.and,
    $not: Op.not,
    $nor: Op.not,
    $or: Op.or,
    $exists: Op.contains,
    $regex: Op.regexp,
    $nregex: Op.notRegexp,
    $between: Op.between,
    $nbetween: Op.notBetween,
    $elementMatch: Op.contains,
    $size: Op.values.toString().length,
    $ceil: Op.col,
  }
});

/**
 * Synchronizes the database and emits an event when the connection is successful.
 * @returns {Promise} A promise that resolves when the database is synchronized.
 */
db.sync().then(() => {
  //Events.emit('databaseConnected');
  if (checkAlert() == true) console.log(`\u001b[31m[Cherry3]\u001b[0m \u001b[32mDatabase connected\u001b[0m \u001b[33m${new Date().toLocaleString()}\u001b[0m`);
}).catch((err) => {
  //Events.emit('databaseConnectionFailed', err);
  if (checkAlert() == true) console.log(`\u001b[31m[Cherry3]\u001b[0m \u001b[31mDatabase connection failed\u001b[0m \u001b[33m${new Date().toLocaleString()}\u001b[0m\n\n${err}`);
});

/**
 * Exports the database connection and the DatabaseInformation function.
 * @type {Object}
 * @property {Sequelize} db - The database connection.
 * @property {Function} DatabaseInformation - The function to retrieve information about the database file.
 */
module.exports = { db, DatabaseInformation };

/**
 * Retrieves information about the database file.
 * @returns {Object} An object containing the following properties:
 * - fileSize: The size of the file in megabytes (MB).
 * - lastModified: The date and time when the file was last modified.
 * - createdAt: The date and time when the file was created.
 * - uid: The user ID of the file owner.
 */
function DatabaseInformation() {
  var file = fs.existsSync(path.join(process.cwd(), filePath()));
  if (!file) return undefined;
  var stat = fs.statSync(path.join(process.cwd(), filePath()));

  return {
    fileSize: ((stat.size / 1024) / 1024).toFixed(2) + " MB",
    lastModified: stat.mtime.toLocaleString(),
    createdAt: stat.birthtime.toLocaleString(),
    uid: stat.uid
  };
}

/**
 * Retrieves the file path from the sqlconfig.json file.
 * If the file does not exist, it creates a new one with a default file path.
 * @returns {string} The file path from the sqlconfig.json file.
 * @throws {Error} If the file path is not found in the json or if the file does not exist.
 */
function filePath() {
  if (!fs.existsSync(path.join(process.cwd(), "sqlconfig.json"))) {
    fs.writeFileSync(path.join(process.cwd(), "sqlconfig.json"), `
{
  "filePath": "./database.sqlite",
  "connectionAlert": true,
  "backup": false,
  "backupPath": "./backup.sqlite",
  "backupInterval": 3600000,
  "backupAlert": false
}
`, "utf-8");
  }

  var file = fs.readFileSync(path.join(process.cwd(), "sqlconfig.json"), "utf-8");
  var json = JSON.parse(file);
  if (!json?.filePath) throw new Cherry3Error("File path is not found in the json", "error");
  return json?.filePath;
}

/**
 * Checks if the connection alert is enabled in the sqlconfig.json file.
 * @returns {boolean} True if the connection alert is enabled, false otherwise.
 */
function checkAlert() {
  if (fs.existsSync(path.join(process.cwd(), "sqlconfig.json"))) {
    var file = fs.readFileSync(path.join(process.cwd(), "sqlconfig.json"), "utf-8");
    var json = JSON.parse(file);
    if (json?.connectionAlert) return true;
    return false;
  }
}

/**
 * Sets up the backup interval based on the configuration in the sqlconfig.json file.
 */
backupInterval();
async function backupInterval() {
  if (fs.existsSync(path.join(process.cwd(), "sqlconfig.json"))) {
    var file = fs.readFileSync(path.join(process.cwd(), "sqlconfig.json"), "utf-8");
    var json = JSON.parse(file);
    if (json?.backupInterval && json?.backup && json?.backupPath) {
      if (isNaN(json?.backupInterval)) throw new Cherry3Error("Backup interval must be a number", "error");
      if (json?.backupInterval < 60000) throw new Cherry3Error("Backup interval must be greater than 60000", "error");
      setInterval(() => {
        var backup = path.join(process.cwd(), filePath())
        fs.writeFileSync(path.join(process.cwd(), json?.backupPath), fs.readFileSync(backup));
        //Events.emit('backupCreated');
        if (json?.backupAlert) console.log(`\u001b[36m[SQLITE]\u001b[0m \u001b[32mBackup created\u001b[0m \u001b[33m${new Date().toLocaleString()}\u001b[0m`);
      }, json?.backupInterval);
    }
  }
}
