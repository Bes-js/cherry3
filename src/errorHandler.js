"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*const Events = require('./events');*/

const redAlert = (error) => `\x1b[31m${error}\x1b[0m`;
const yellowAlert = (error) => `\x1b[33m${error}\x1b[0m`;
const blueAlert = (error) => `\x1b[36m${error}\x1b[0m`;


module.exports = class Cherry3Error extends Error {
  constructor(error,type = "error") {

   super(`${
    type === "error" ? redAlert(error) : 
    type === "info" ? blueAlert(error) : 
    type === "warn" ? yellowAlert(error) : 
    redAlert("Invalid error")
   }`)
   //Events.emit('unexpectedError', error);
  }

  
}
