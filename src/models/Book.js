import mongoose from "mongoose"

const bookSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    caption:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    rating:{
            type:String,
            required:true,
            min:1,
            max:6
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})





const book=mongoose.model("Book",bookSchema)

export  default book