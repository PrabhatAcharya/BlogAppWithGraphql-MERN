"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const connection_1 = require("./database/connection");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
(0, connection_1.Connection)().then(() => {
    app.listen(process.env.PORT, () => {
        console.log('Mongodb Server Connected and listening to port ' + process.env.PORT);
    });
}).catch(error => console.log(error));
//# sourceMappingURL=index.js.map