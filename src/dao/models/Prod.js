import mongoose from "mongoose";

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
        unique: true
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

export const prodModel = mongoose.model( productCollection, prodSchema )