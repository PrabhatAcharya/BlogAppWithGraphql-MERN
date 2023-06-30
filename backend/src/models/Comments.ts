import {Schema,model} from "mongoose";

const commentSchema = new Schema({
    text:{
        type: String,
        required: true
    },
    date:{
        type:Date,
        required: true
    }
})
const Comment = model("Comment", commentSchema);
export default Comment;