import { Router } from "express";
import { prodModel } from "../dao/models/Prod.js";

const router = new Router();

export default router;

// import { ProductManager } from '../productManager.js';
// const productManager = new ProductManager("./files")


router.get('/',async (req, res)=>{

    let products = [];
    
    if(req.query.limit){
        products = await prodModel.find().limit(parseInt(req.query.limit));
    }else if(req.query.sort){
        if(req.query.sort === "asc"){
            products = await prodModel.find().sort({price: 1});
        }else{
            products = await prodModel.find().sort({price: -1});
        }
        products = await prodModel.find().limit(2);
    }else{
        products = await prodModel.find({}).lean();
       
    }
    res.send(products)
})
router.get('/:pid',async (req, res)=>{
    const product = await prodModel.findOne({_id: req.params.pid});
    console.log(req.params.pid)
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
    const obj = req.body;
    const response = await prodModel.findOneAndUpdate({_id:req.params.pid},obj);

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