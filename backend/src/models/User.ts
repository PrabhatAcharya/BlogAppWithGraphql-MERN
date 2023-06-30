import { Schema,model } from "mongoose";

const userSchme:Schema=new Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{  
        type: "string",
        required: true,
        minLenght:6
    }
})
const User=model("User",userSchme);
export default User;