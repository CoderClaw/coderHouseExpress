import express from 'express';
const app = express();
import { ProductManager } from './productManager.js';
const productManager = new ProductManager("../files")


app.get('/products',async (req, res)=>{

    const products = await productManager.getProducts();
    
    if(req.query.limit){
        res.send(products.slice(0,parseInt(req.query.limit)))
    }else{
        res.send(products)
    }
    
})
app.get('/products/:pid',async (req, res)=>{
    const product = await productManager.getProductById(parseInt(req.params.pid));
    res.send(product)
})



app.listen(8080, err =>{
    console.log("escuchando en puerto 8080")
})