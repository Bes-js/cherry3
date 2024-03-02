<br/>
<img src="./assets/package-logo.png">
<h4 align="center">Cherry3 is a SQlite object modeling tool designed to work in an asynchronous environment.</h6>
<p align="center">
<img src="https://img.shields.io/npm/v/cherry3?style=for-the-badge">
<img src="https://img.shields.io/github/repo-size/Bes-js/cherry3?style=for-the-badge"> 
<img src="https://img.shields.io/npm/l/cherry3?style=for-the-badge"> 
<img src="https://img.shields.io/npm/dt/cherry3?style=for-the-badge"> 
<img src="https://img.shields.io/github/package-json/dependency-version/Bes-js/cherry3/knex?style=for-the-badge">
<img src="https://img.shields.io/github/package-json/dependency-version/Bes-js/cherry3/sqlite3?style=for-the-badge"> 
<a href="https://discord.gg/luppux" target="_blank"> 
<img alt="Discord" src="https://img.shields.io/badge/Support-Click%20here-7289d9?style=for-the-badge&logo=discord"> 
</a>
<a href="https://www.buymeacoffee.com/beykant" target="_blank">
<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" width="120px" height="30px" alt="Buy Me A Coffee">
</a>
</p>

#
## Features

* **Simple Setup:** Get started quickly with minimal configuration.
* **SQlite Storage:** Sqlite Will Come To Your Help Because It Is Compressed, Economical And Fast.
* **Asynchronous Operations:** Perform Database Operations Asynchronously Using Promises.
* **Filter and Update:** Easily filter and update records in your collections.
#
## Usage
```js
const { Model, Schema, Types } = require('cherry3');
/* import { Model, Schema, Types } from 'cherry3'; For ESModule */

// Define a schema for a collection
const userSchema = Schema({
    username: { type: String, default: 'fivesobes' },
    age: Types.Number,
    email: { type: Types.String, default: "support@luppux.com" },
    isAdmin: Boolean,
    interests: { type: Array, required: true},
    balance: Types.Float,
    date: Types.Date
});

// Create a model for the "users" collection
const UserModel = new Model('Users', userSchema);


// Example data
const userData = {
  username: 'fivesobes',
  age: 20,
  email: 'support@luppux.com',
  isAdmin: false,
  interests: ['coding', 'reading', 'ertus-mom'],
};

(async () => {
// CRUD operations
  try {
    /* SAVE NEW USER */

    // Create or save new user
    await UserModel.save(userData);

    await UserModel.create(userData,{multi: true});

    await UserModal.insertOne(userData);

    await UserModal.insertMany([
      { username: "piku", age: 19, interests: ["coding"] },
      { username: "vante", age: 18, interests: ["ertus-mom"] },
    ]);


    /* FIND USERS */

    // Find multiple users with conditions
    const users = await UserModel.find({ age: 20, isAdmin: false },{ limit: 2 });

    // Find a single user with conditions
    const user = await UserModel.findOne({ age: 20, isAdmin: false });

    // Find a single user with by id
    const user = await UserModal.findById(1);


    /* UPDATE USER */

    // Update or create a user with upsert true
    await UserModel.updateOne({ username: "fivesobes" }, 
    { $inc: { age: 1, balance: 100 } }, { new: true, upsert: true });

    // Other usage
    await UserModel.findOneAndUpdate({ username: "fivesobes" }, 
    { $inc: { age: 1, balance: 100 } }, { new: true, upsert: true });

    // Update multiple users
    await UserModel.updateMany({ age: 21 }, { $dec: { age: 1 } });

    // Other usage
    await UserModel.update({ age: 21 }, { $pull: { interests: ["ertus-mom"] } });

    // Update user with id
    await UserModel.findByIdAndUpdate(1,{ $set:{ isAdmin: true } });


    /* DELETE USER */

    // Delete a single user
    await UserModel.deleteOne({ username: "fivesobes" });

    // Delete multiple users
    await UserModel.deleteMany({ age: 20 });

    // Delete a single user with by id
    await UserModel.findByIdAndDelete(1);


     /* OTHERS */

    // Schema information
    const schemaInfo = await UserModel.schemaInfo();

    // Drop database
    await UserModel.dropCollection();

    // All Schema data
    await UserModel.AllRows({ limit: 3 });




  } catch (error) {
    console.error('Error performing CRUD operations:', error.message);
  }
})();
```
#
## Settings File Definitions
> **sqlconfig.json**
```json
{
  "filePath": "./database.sqlite",
  "backup": false,
  "backupPath": "./backup.sqlite",
  "backupInterval": 3600000,
  "backupAlert": false
} 
```

| Variable              | Description                                     | Type  | Default |
| ----------------------| ------------------------------------------------|-------| ----------------------- |
| `filePath`    | *File Path Where You Want Your Database File (package.json is referenced)* | **String** | **"./database.sqlite"** |
| `backup` | *Backing Up the Database File* | **Boolean** | **false** |
| `backupPath`  | *File Path to Save the Backup File (package.json is referenced)* | **String** | **"./backup.sqlite"** |
| `backupInterval` | *How Long Does It Take to Get a Backup (in Milliseconds)* | **Number** | **3600000** |
| `backupAlert` | *Notification on the Console When a Backup is Taken* | **Boolean** | **false** |
#
## Types
```js
const { Types } = require('cherry3');

Types.Number // Example => 5
Types.Float // Example => 5.76
Types.Text // Example => test data text
Types.Date // Example => 1.03.2024
Types.String // Example => "test data text"
Types.Boolean // Example => true or false
Types.Array // Example => [ "five" , "so" , 5 ]
```
#
## Sqlite Viewer Extension
[For Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=yy0931.vscode-sqlite3-editor)

## License

Cherry3 is licensed under the **Apache License 2.0** License. See the [LICENSE](./LICENSE.md) file for details.

## Changelog

[*=>* **Click Here**](./CHANGELOG.md)

## Support

[![Discord Banner](https://api.weblutions.com/discord/invite/luppux/)](https://discord.gg/luppux)
