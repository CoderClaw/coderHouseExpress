import { Schema, model }  from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2'

const userCollection = 'users'

const userSchema = new Schema({
    Nombre: {
        type: String,
        index: true
    },
    Apellido: String,
    email: {
        type: String,
        required: true, 
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        default:'usuario'
    }
})
// odm 

userSchema.plugin(mongoosePaginate)

export const userModel = model(userCollection, userSchema)