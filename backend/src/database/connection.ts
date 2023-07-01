import mongoose from "mongoose";

export const Connection=async()=>{
    const pass=process.env.MONGODB_PASSWORD
    const URL=`mongodb+srv://prabhat:${pass}@cluster0.b24a6wd.mongodb.net/?retryWrites=true&w=majority`
    try {
        await mongoose.connect(URL)
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}