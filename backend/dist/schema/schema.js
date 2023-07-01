"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentType = exports.BlogType = exports.UserType = void 0;
const graphql_1 = require("graphql");
const Blog_1 = __importDefault(require("../models/Blog"));
const Comments_1 = __importDefault(require("../models/Comments"));
const User_1 = __importDefault(require("../models/User"));
exports.UserType = new graphql_1.GraphQLObjectType({
    name: "UserType",
    fields: () => ({
        id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        name: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        password: { type: graphql_1.GraphQLString },
        blogs: {
            type: new graphql_1.GraphQLList(exports.BlogType),
            //now we have fetch related blogs according user
            async resolve(parent) {
                return await Blog_1.default.find({ user: parent.id });
            }
        },
        comments: {
            type: new graphql_1.GraphQLList(exports.CommentType),
            async resolve(parent) {
                return await Comments_1.default.find({ user: parent.id });
            }
        }
    }),
});
//Blog Schema
exports.BlogType = new graphql_1.GraphQLObjectType({
    name: "BlogType",
    fields: () => ({
        id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        title: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        content: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        date: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        user: {
            type: exports.UserType,
            async resolve(parent) {
                return await User_1.default.findById(parent.user);
                //we have to access the related user check Blog mogoose model ther we have refrences to the User model
            }
        },
        comments: {
            type: new graphql_1.GraphQLList(exports.CommentType),
            async resolve(parent) {
                return Comments_1.default.find({ blog: parent.id });
            }
        }
    })
});
//comment schema
exports.CommentType = new graphql_1.GraphQLObjectType({
    name: "CommentType",
    fields: () => ({
        id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        text: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        user: {
            type: exports.UserType,
            async resolve(parent) {
                return await User_1.default.findById(parent.user);
            }
        },
        blog: {
            type: exports.BlogType,
            async resolve(parent) {
                return await Blog_1.default.findById(parent.blog);
            }
        }
    })
});
//# sourceMappingURL=schema.js.map