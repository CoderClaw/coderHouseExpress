import { Router } from "express";
import { prodModel } from "../dao/models/Prod.js";

const router = new Router();

export default router;

// import { ProductManager } from '../productManager.js';
// const productManager = new ProductManager("./files")


router.get('/',async (req, res)=>{

    const products = await prodModel.find({}).lean();
    
    if(req.query.limit){
        res.send(products.slice(0,parseInt(req.query.limit)))
    }else{
        res.send(products)
    }
    
})
router.get('/:pid',async (req, res)=>{
    const product = await prodModel.findOne({_id: req.params.id});
    
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

    const response = await prodModel.create({title,description,code,price,status:true,stock,category,thumbnails:"thumbnail"});

    if(response){
        res.status(200).send({staus: "success",payload: response}) 
    }else{
        res.status(401).send({staus: "error", payload: response}) 
    }
     
})

router.put('/:pid',async (req, res)=>{

    const id = req.params.pid;
    const {title,description,code,price,status,stock,category,thumbnails} = req.body;
    const response = await prodModel.findOneAndUpdate({_id:req.params.id},{title,description,code,price,status:true,stock,category,thumbnails:"thumbnail"});

    if(response){
        res.send(response) 
    }else{
        const products = await prodModel.find({});
        res.send(products) 
    }
    
})

router.delete('/:pid',async (req, res)=>{

    const pid = req.params.pid;
    const response = await prodModel.deleteOne({_id:pid});
    if(response){
        res.send(response) 
    }else{
        const products = await prodModel.find({});
        res.send(products) 
    }
    
})