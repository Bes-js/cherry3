"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const fs = require('fs');
const knex = require('knex');


const db = knex({
  client: 'sqlite3',
  connection: {
    filename: path.join(process.cwd(),filePath())
  },
  useNullAsDefault: true
});


module.exports = { db, DatabaseInformation };


function DatabaseInformation() {
  var file = fs.existsSync(path.join(process.cwd(),filePath()));
  if(!file) return undefined;
  var stat = fs.statSync(path.join(process.cwd(),filePath()));

  return {
  fileSize: ((stat.size / 1024) / 1024).toFixed(2) + " MB",
  lastModified: stat.mtime.toLocaleString(),
  createdAt: stat.birthtime.toLocaleString(),
  uid: stat.uid
  };


};



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
  "backup": false,
  "backupPath": "./backup.sqlite", 
  "backupInterval": 3600000,
  "backupAlert": false
} 
`, "utf-8");
}

var file = fs.readFileSync(path.join(process.cwd(), "sqlconfig.json"), "utf-8");
var json = JSON.parse(file);
if(!json?.filePath) throw new Error("File path is required");
return json?.filePath;
}




backupInterval();
async function backupInterval() {
  if (fs.existsSync(path.join(process.cwd(), "sqlconfig.json"))) {
  var file = fs.readFileSync(path.join(process.cwd(), "sqlconfig.json"), "utf-8");
  var json = JSON.parse(file);
  if(json?.backupInterval && json?.backup && json?.backupPath){
  if(isNaN(json?.backupInterval)) throw new Error("Backup interval must be a number");
  if(json?.backupInterval < 60000) throw new Error("Backup interval must be greater than 60000");
  setInterval(() => {
   var backup = path.join(process.cwd(),filePath())
   if(json?.backupAlert) {
      fs.writeFileSync(path.join(process.cwd(), json?.backupPath), fs.readFileSync(backup));
      console.log(`\u001b[36m[SQLITE]\u001b[0m \u001b[32mBackup created\u001b[0m \u001b[33m${new Date().toLocaleString()}\u001b[0m`);
   }
  }, json?.backupInterval);
  }
  }
}