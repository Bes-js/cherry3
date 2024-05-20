"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*const Events = require('./events');*/

const redAlert = (error) => `\x1b[31m${error}\x1b[0m`;
const blueAlert = (error) => `\x1b[36m${error}\x1b[0m`;


module.exports = class Cherry3Debug {
  constructor() {}

    static sendLogMessage(debugMessage) {
        console.log(`${redAlert(`[DEBUG]`)} - ${blueAlert(debugMessage)}`)
    }

  
}
