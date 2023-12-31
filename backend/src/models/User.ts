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
    },
    blogs:[{type:Schema.Types.ObjectId,ref:"Blog"}],
    comments:[{type:Schema.Types.ObjectId,ref:"Comment"}]
})
const User=model("User",userSchme);
export default User;