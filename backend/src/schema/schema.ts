
import {GraphQLObjectType,GraphQLNonNull,GraphQLString,GraphQLID} from "graphql"
const UserType=new GraphQLObjectType({
    name:"UserType",
    fields:()=>({
        id:{type:new GraphQLNonNull(GraphQLID)},
        name:{type:GraphQLString},
        email:{type:GraphQLString},
        password:{type:GraphQLString}
    }),

})
//Blog Schema
const BlogType=new GraphQLObjectType({
 name:"BlogType",
 fields:()=>({
    id:{type:new GraphQLNonNull(GraphQLID)},
    title:{type:GraphQLString},
    content:{type:GraphQLString},
    date:{type:GraphQLString}
 })

})
//comment schema
const CommentType=new GraphQLObjectType({
    name:"CommentType",
    fields:()=>({
        id:{type:new GraphQLNonNull(GraphQLID)},
        text:{type:new GraphQLNonNull(GraphQLString)}
    })
})