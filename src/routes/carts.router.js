import { Router } from "express";
import { cartModel } from "../dao/models/Cart.js";
import { prodModel } from "../dao/models/Prod.js";

const router = new Router();

export default router;

// import { CartManager } from '../cartManager.js';
// const cartManager = new CartManager("./files")


router.get('/',async (req, res)=>{

    const carts = await cartModel.find({})
    
    if(req.query.limit){
        res.send(carts.slice(0,parseInt(req.query.limit)))
    }else{
        res.send(carts)
    }
    
})
router.get('/:cid',async (req, res)=>{
    const cart = await cartModel.findOne({_id: req.params.cid})

    if(cart){
        return res.send(cart.products)
    }else{
        return res.send({
            error: "No se ha encontrado un carrito con la id proporcionada"
        })
    }   
    
})

router.post('/',async (req, res)=>{

    const resp = await cartModel.create({});
    console.log(resp)
    res.send(resp)
    
})

router.post('/:cid/product/:pid',async (req, res)=>{

    try{
        const {cid, pid} = req.params;

        const cart = await cartModel.findById(cid).lean()
        const prod = await prodModel.findById(pid).lean()
        
        if(!prod){
            return res.status(401).send("product not found")
        }
        console.log(prod._id.toString())
        if(!cart.products.find(obj => obj.product === prod._id.toString())){
            cart.products.push({
                product: prod._id.toString(),
                quantity: 1
            })
        }else{
            const selectedCart = cart.products.findIndex(obj => obj.product === prod._id.toString())
            cart.products[selectedCart].quantity++
        }
        
    
        const resp = await cartModel.findOneAndUpdate({_id:cid},{products: cart.products});
        res.send(resp)
    }catch(error){
        console.log(error)
    }
    
    
})

router.put('/',async (req, res)=>{

    
    
})

router.delete('/',async (req, res)=>{

    
    
})