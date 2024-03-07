<br/>
<img src="./assets/package-logo.png">
<h4 align="center">Cherry3 is a SQlite object modeling tool designed to work in an asynchronous environment.</h6>
<p align="center">
<img src="https://img.shields.io/npm/v/cherry3?style=for-the-badge">
<img src="https://img.shields.io/github/repo-size/Bes-js/cherry3?style=for-the-badge"> 
<img src="https://img.shields.io/npm/l/cherry3?style=for-the-badge"> 
<img src="https://img.shields.io/npm/dt/cherry3?style=for-the-badge"> 
<img src="https://img.shields.io/github/package-json/dependency-version/Bes-js/cherry3/sequelize?style=for-the-badge">
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
## Documentation
[*=>* **Click Here**](https://fivesobes.gitbook.io/cherry3/)
## Usage
```js
import { Model, Schema, Types } from 'cherry3';
/* const { Model, Schema, Types } = require('cherry3'); For CommonJS */

// Define a schema for a collection
const userSchema = Schema({
    username: { type: Types.String, default: 'fivesobes' },
    age: Types.Number,
    email: { type: Types.String, default: "support@luppux.com" },
    isAdmin: Types.Boolean,
    interests: Types.Array,
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
    /* FIND USERS */

    // Find multiple users with conditions
    const users = await UserModel.find({ age: 20, isAdmin: false });
    console.log(users);


  } catch (error) {
    console.error('Error performing CRUD operations:', error.message);
  }
})();
```
#
## Settings File Definitions
[*=>* **Click Here**](https://fivesobes.gitbook.io/cherry3/sql-config-file)
#
## Types
```js
import { Types } from 'cherry3';

Types.Number // Example => 5
Types.Object // Example => { test:"data text", test3: 5 } 
Types.Date // Example => 1.03.2024
Types.String // Example => "test data text"
Types.Boolean // Example => true or false
Types.Array // Example => [ "five" , "so" , 5 ]
```
#
## Sqlite Viewer Extension
<a href="https://marketplace.visualstudio.com/items?itemName=yy0931.vscode-sqlite3-editor"> <img src="https://raw.githubusercontent.com/yy0931/sqlite3-editor/main/demo.gif"> </a>

[For Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=yy0931.vscode-sqlite3-editor)

## License

Cherry3 is licensed under the **Apache License 2.0** License. See the [LICENSE](./LICENSE.md) file for details.

## Changelog

[*=>* **Click Here**](./CHANGELOG.md)

## Support

[![Discord Banner](https://api.weblutions.com/discord/invite/luppux/)](https://discord.gg/luppux)
