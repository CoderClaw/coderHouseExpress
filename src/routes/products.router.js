import { Router } from "express";

const router = new Router();

export default router;

import { ProductManager } from '../productManager.js';
const productManager = new ProductManager("./files")


router.get('/',async (req, res)=>{

    const products = await productManager.getProducts();
    
    if(req.query.limit){
        res.send(products.slice(0,parseInt(req.query.limit)))
    }else{
        res.send(products)
    }
    
})
router.get('/:pid',async (req, res)=>{
    const product = await productManager.getProductById(parseInt(req.params.pid));
    console.log(product)
    if(product){
        return res.send(product)
    }else{
        return res.send({
            error: "No se ha encontrado un producto con la id proporcionada"
        })
    }   
    
})

router.post('/',async (req, res)=>{
    
    const {title,description,code,price,status,stock,category,thumbnails} = req.body;

    console.log(req.body)

    const response = await productManager.addProduct(title,description,code,price,status,stock,category,thumbnails)
    
    console.log(response)
    if(response){
        res.send(response) 
    }else{
        const products = await productManager.getProducts();
        res.send(products) 
    }
       
})

router.put('/:pid',async (req, res)=>{

    const id = req.params.pid;
    const obj = req.body;
    const response = await productManager.updateProduct(id,obj)

    if(response){
        res.send(response) 
    }else{
        const products = await productManager.getProducts();
        res.send(products) 
    }
    
})

router.delete('/:pid',async (req, res)=>{

    const pid = req.params.pid;
    const response = await productManager.deleteProduct(pid);
    if(response){
        res.send(response) 
    }else{
        const products = await productManager.getProducts();
        res.send(products) 
    }
    
})