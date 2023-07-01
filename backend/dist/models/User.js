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
    },
    blogs: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Blog" }],
    comments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Comment" }]
});
const User = (0, mongoose_1.model)("User", userSchme);
exports.default = User;
//# sourceMappingURL=User.js.map