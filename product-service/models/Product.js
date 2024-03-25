import { Schema, model } from "mongoose";


const ProductSchema = Schema({
    name:{type:String, required:true, unique:true},
    description:{type:String, required:true },
    price:{type:Number, required:true }
})

export default model('product', ProductSchema)