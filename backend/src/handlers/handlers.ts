//now  we hace define queries and mutations for graphql to handling requestes
import {GraphQLObjectType,GraphQLList,GraphQLSchema,GraphQLID, GraphQLNonNull, GraphQLString} from "graphql"
import { UserType,BlogType,CommentType } from "../schema/schema"
import User from "../models/User"
import Blog from "../models/Blog"

import Comment from "../models/Comments"
import {Document} from "mongoose"
import {hashSync} from "bcryptjs"

const RootQuery=new GraphQLObjectType({
  name:"RootQuery",
   fields:{
    //get all users
    users:{
        type:new GraphQLList(UserType),
       async resolve(){
            return await User.find()
        }
    },
    //get all blogs
    blogs:{
        type:new GraphQLList(BlogType),
        async resolve(){
            return await Blog.find()
        }
    },

    //get allcomments
    comments:{
        type:new GraphQLList(CommentType),
        async resolve(){
            return await Comment.find()
        }
    }
   }

})
//now we have to create mutations , which allows us to create,update and delete data
const mutations=new GraphQLObjectType({
    name:"mutation",
    fields:{
        //user signup
        signup:{
            type:UserType,
            args:{
               name:{ type:new GraphQLNonNull(GraphQLString)},
               email:{type:new GraphQLNonNull(GraphQLString)},
               password:{type:new GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent,args){
                let existingUser:Document<any,any,any>;
                try {
                    existingUser=await User.findOne({email:args.email});
                    if(existingUser) return new Error(`User ${args.email} alrent Exist`);
                    const hashedPassword=hashSync(args.password);
                    const user = new User({name:args.name,email:args.email,password:hashedPassword});
                   return await user.save();
                } catch (error) {
                    return new Error(`User Signup Failed: ${error.message}`);
                }
            }

        }
    }
})
//now we have to make queries inside the graphqlschema 

export default new GraphQLSchema({query:RootQuery,mutation:mutations})