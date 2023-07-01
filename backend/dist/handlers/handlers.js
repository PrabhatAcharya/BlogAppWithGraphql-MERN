"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//now  we hace define queries and mutations for graphql to handling requestes
const graphql_1 = require("graphql");
const schema_1 = require("../schema/schema");
const User_1 = __importDefault(require("../models/User"));
const Blog_1 = __importDefault(require("../models/Blog"));
const Comments_1 = __importDefault(require("../models/Comments"));
const bcryptjs_1 = require("bcryptjs");
const RootQuery = new graphql_1.GraphQLObjectType({
    name: "RootQuery",
    fields: {
        //get all users
        users: {
            type: new graphql_1.GraphQLList(schema_1.UserType),
            async resolve() {
                return await User_1.default.find();
            }
        },
        //get all blogs
        blogs: {
            type: new graphql_1.GraphQLList(schema_1.BlogType),
            async resolve() {
                return await Blog_1.default.find();
            }
        },
        //get allcomments
        comments: {
            type: new graphql_1.GraphQLList(schema_1.CommentType),
            async resolve() {
                return await Comments_1.default.find();
            }
        }
    }
});
//now we have to create mutations , which allows us to create,update and delete data
const mutations = new graphql_1.GraphQLObjectType({
    name: "mutation",
    fields: {
        //user signup
        signup: {
            type: schema_1.UserType,
            args: {
                name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                email: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                password: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            async resolve(parent, args) {
                let existingUser;
                try {
                    existingUser = await User_1.default.findOne({ email: args.email });
                    if (existingUser)
                        return new Error(`User ${args.email} alrent Exist`);
                    const hashedPassword = (0, bcryptjs_1.hashSync)(args.password);
                    const user = new User_1.default({ name: args.name, email: args.email, password: hashedPassword });
                    return await user.save();
                }
                catch (error) {
                    return new Error(`User Signup Failed: ${error.message}`);
                }
            }
        },
        //user login
        login: {
            type: schema_1.UserType,
            args: {
                email: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                password: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            async resolve(parent, { email, password }) {
                let existingUser;
                try {
                    existingUser = await User_1.default.findOne({ email });
                    if (!existingUser) {
                        return new Error(`Could not find user with this ${email}`);
                    }
                    let decryptedPassword = (0, bcryptjs_1.compareSync)(password, 
                    //@ts-ignore
                    existingUser?.password);
                    if (!decryptedPassword)
                        return new Error(`Could not match details`);
                    return existingUser;
                }
                catch (error) {
                    return new Error(error.message);
                }
            }
        },
        //create blog
        addBlog: {
            type: schema_1.BlogType,
            args: {
                title: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                content: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                date: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            async resolve(parent, args) {
                let blog;
                try {
                    blog = new Blog_1.default({ title: args.title, content: args.content, date: args.date });
                    return await blog.save();
                }
                catch (error) {
                    return new Error(error.message);
                }
            }
        },
        //update blog
        updateBlog: {
            type: schema_1.BlogType,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                title: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                content: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            async resolve(parent, { id, title, content }) {
                let existingBlog;
                try {
                    existingBlog = await Blog_1.default.findById(id);
                    if (!existingBlog)
                        return new Error("Blog not found");
                    return await Blog_1.default.findByIdAndUpdate(id, {
                        title,
                        content
                    }, { new: true });
                    //new: true will send the update result to the graphql beacuse updation will take some some time to get updated value will have to do the same
                }
                catch (error) {
                    return new Error(error.message);
                }
            }
        },
        //delete Blog
        deleteBlog: {
            type: schema_1.BlogType,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
            },
            async resolve(parent, { id }) {
                let existingBlog;
                try {
                    existingBlog = await Blog_1.default.findById(id);
                    if (!existingBlog)
                        return new Error("No Blog found");
                    return await Blog_1.default.findByIdAndRemove(id);
                }
                catch (error) {
                    return new Error(error.message);
                }
            }
        }
    }
});
//now we have to make queries inside the graphqlschema 
exports.default = new graphql_1.GraphQLSchema({ query: RootQuery, mutation: mutations });
//# sourceMappingURL=handlers.js.map