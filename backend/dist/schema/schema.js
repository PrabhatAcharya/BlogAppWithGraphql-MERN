"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentType = exports.BlogType = exports.UserType = void 0;
const graphql_1 = require("graphql");
exports.UserType = new graphql_1.GraphQLObjectType({
    name: "UserType",
    fields: () => ({
        id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        name: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        password: { type: graphql_1.GraphQLString }
    }),
});
//Blog Schema
exports.BlogType = new graphql_1.GraphQLObjectType({
    name: "BlogType",
    fields: () => ({
        id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        title: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        content: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        date: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) }
    })
});
//comment schema
exports.CommentType = new graphql_1.GraphQLObjectType({
    name: "CommentType",
    fields: () => ({
        id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        text: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) }
    })
});
//# sourceMappingURL=schema.js.map