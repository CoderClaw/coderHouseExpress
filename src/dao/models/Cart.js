import mongoose from "mongoose";
import { prodModel } from "./Prod.js";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
    products:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'prodModel',
            require: false,
        }
    ]
})

export const cartModel = mongoose.model( cartCollection, cartSchema )