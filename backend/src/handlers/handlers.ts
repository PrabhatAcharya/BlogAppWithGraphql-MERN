//now  we hace define queries and mutations for graphql to handling requestes
import {GraphQLObjectType,GraphQLList,GraphQLSchema,GraphQLID, GraphQLNonNull, GraphQLString} from "graphql"
import { UserType,BlogType,CommentType } from "../schema/schema"
import User from "../models/User"
import Blog from "../models/Blog"

import Comment from "../models/Comments"
import {Document, startSession} from "mongoose"
import {compareSync, hashSync} from "bcryptjs"

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

        },
        //user login
        login:{
            type:UserType,
             args:{
               email:{type:new GraphQLNonNull(GraphQLString)},
               password:{type:new GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent,{email,password}){
                let existingUser:Document<any,any,any>;
                try {
                    existingUser = await User.findOne({email})
                    if(!existingUser){
                        return new Error(`Could not find user with this ${email}`);
                    }
                    let decryptedPassword = compareSync(password,
                        //@ts-ignore
                        existingUser?.password)
                        if(!decryptedPassword) return new Error(`Could not match details`);
                        return existingUser

                } catch (error) {
                    return new Error(error.message);
                }
            }
        },
        //create blog
        addBlog:{
            type:BlogType,
            args:{
                title:{type:new GraphQLNonNull(GraphQLString)},
                content:{type:new GraphQLNonNull(GraphQLString)},  
                date:{type:new GraphQLNonNull(GraphQLString)},
                user:{type:new GraphQLNonNull(GraphQLID)},
            },
            async resolve(parent,args){
                let blog:Document<any,any,any>
                //to populate the data to refrenced collection we need to create a session
                const session =await startSession();
               try {
                session.startTransaction({session});
                blog=new Blog({title:args.title,content:args.content,date:args.date,user:args.user});   
                //checking user if we have the user with parent user id(line 97)
                const existingUser = await User.findById(args.user)
                if(!existingUser) return new Error("User Not Found! terminating session");
                //after creating instance of blog the we need to start the 
                //transaction
            
                //then we need to commit the transaction whic comes under finaly, before commiting we need to save the record in both the user and the blog.
                existingUser.blogs.push(blog);
                await existingUser.save({session});
               return await blog.save({session});
               } catch (error) {
                return new Error(error.message);
               }finally{
                await session.commitTransaction();
               }
            }
        },
        //update blog
        updateBlog:{
            type:BlogType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLID)},
               title:{type:new GraphQLNonNull(GraphQLString)},
                content:{type:new GraphQLNonNull(GraphQLString)},  
            },
            async resolve(parent,{id,title,content}){
            let existingBlog:Document<any,any,any>
            try {
                existingBlog=await Blog.findById(id)
                if(!existingBlog) return new Error("Blog not found");
                return await Blog.findByIdAndUpdate(id,{
                    title,
                    content
                },{new:true})
                //new: true will send the update result to the graphql beacuse updation will take some some time to get updated value will have to do the same
            } catch (error) {
                return new Error(error.message);
            }
            }
        },
        //delete Blog
        deleteBlog:{
            type:BlogType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLID)},
            },
            async resolve(parent,{id}){
                let existingBlog:Document<any,any,any>
                //in delte we have to delte all the comments of user and the blog of user 
                const session=await startSession();
                try {
                   session.startTransaction({session})
                    existingBlog=await Blog.findById(id).populate("user");
                   //@ts-ignore
                    const existingUser=existingBlog?.user
                    if(!existingUser)return new Error(`Could not find linked user to this blog!terminating the session`)

                    if(!existingBlog) return new Error("No Blog found");
                    //pull method in mongoose will pull out the record 
                    existingUser.blogs.pull(existingBlog);
                    await existingUser.save({session});
                    return await Blog.findByIdAndRemove(id);
                } catch (error) {
                    return new Error(error.message);
                }finally{
                    session.commitTransaction();
                }
            }
        }
        
    }
})
//now we have to make queries inside the graphqlschema 

export default new GraphQLSchema({query:RootQuery,mutation:mutations})