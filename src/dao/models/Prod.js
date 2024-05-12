import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productCollection = "products";

const prodSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: false
    },
    description: {
        type: String,
        required: true,
        unique: false
    },
    code: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    price: {
        type: Number,
        required: true,
        unique: false
    },
    status: {
        type: Boolean,
        default: true,
        required: true,
        unique: false
    },
    stock: {
        type: Number,
        required: true,
        unique: false
    },
    category: {
        type: String,
        required: true,
        unique: false
    },
    thumbnails: {
        type: String,
        default: "thumbnail",
        required: false,
        unique: false
    }
})

prodSchema.plugin(mongoosePaginate);

export const prodModel = mongoose.model( productCollection, prodSchema )