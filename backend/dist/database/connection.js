"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Connection = async () => {
    const pass = process.env.MONGODB_PASSWORD;
    const URL = `mongodb+srv://prabhat:${pass}@cluster0.b24a6wd.mongodb.net/?retryWrites=true&w=majority`;
    try {
        await mongoose_1.default.connect(URL);
    }
    catch (error) {
        console.log(error);
        return error.message;
    }
};
exports.Connection = Connection;
//# sourceMappingURL=connection.js.map