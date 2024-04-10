import express from 'express';
const app = express();
import { ProductManager } from './productManager.js';
const productManager = new ProductManager("../files")

import prodRouter from './routes/products.router.js'
import cartRouter from './routes/carts.router.js'

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/products',prodRouter)
app.use('/api/carts',cartRouter)

app.listen(8080, err =>{
    console.log("escuchando en puerto 8080")
})