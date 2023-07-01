"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchme = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: "string",
        required: true,
        minLenght: 6
    }
});
const User = (0, mongoose_1.model)("User", userSchme);
exports.default = User;
//# sourceMappingURL=User.js.map