
import {GraphQLObjectType,GraphQLList,GraphQLNonNull,GraphQLString,GraphQLID} from "graphql"
import Blog from "../models/Blog"
import Comment from "../models/Comments"
import User from "../models/User"
export const UserType=new GraphQLObjectType({
    name:"UserType",
    fields:()=>({
        id:{type:new GraphQLNonNull(GraphQLID)},
        name:{type:GraphQLString},
        email:{type:GraphQLString},
        password:{type:GraphQLString},
        blogs:{
            type:new GraphQLList(BlogType),
            //now we have fetch related blogs according user
            async resolve(parent){
                return await Blog.find({user:parent.id})
            }
        },
        comments:{
            type:new GraphQLList(CommentType),
            async resolve(parent){
                return await Comment.find({user:parent.id});
            }
        }
    }),
})

//Blog Schema
export const BlogType=new GraphQLObjectType({
 name:"BlogType",
 fields:()=>({
    id:{type:new GraphQLNonNull(GraphQLID)},
    title:{type:new GraphQLNonNull(GraphQLString)},
    content:{type:new GraphQLNonNull(GraphQLString)},
    date:{type:new GraphQLNonNull(GraphQLString)},
    user:{
        type:UserType,
        async resolve(parent){
            return await User.findById(parent.user)
            //we have to access the related user check Blog mogoose model ther we have refrences to the User model
        }
    },
    comments:{
        type:new GraphQLList(CommentType),
        async resolve(parent){
            return Comment.find({blog:parent.id})
        }
    }
 })
})
//comment schema
export const CommentType=new GraphQLObjectType({
    name:"CommentType",
    fields:()=>({
        id:{type:new GraphQLNonNull(GraphQLID)},
        text:{type:new GraphQLNonNull(GraphQLString)},
        user:{
          type: UserType,
          async resolve(parent){
            return await User.findById(parent.user);
          } 
        },
        blog:{
            type: BlogType,
            async resolve(parent){
                return await Blog.findById(parent.blog);
            }
        }
    })
})