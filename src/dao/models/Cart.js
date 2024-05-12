import mongoose from "mongoose";
import { prodModel } from "./Prod.js";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
    products: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            },
            quantity: Number
        }]
    }
})

// cartSchema.pre("find",function(){
//     this.populate('products.product')
// })

export const cartModel = mongoose.model( cartCollection, cartSchema )