import { Schema, model } from "mongoose";

const OrderSchema = Schema({
    products: [
        {
            name: String,
            description: String,
            price: Number
        }
    ]
    ,
    total: Number
})

export default model("order", OrderSchema)