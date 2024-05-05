import { Router } from "express";
import { cartModel } from "../dao/models/Cart.js";

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

    const {cid, pid} = req.params;

    const resp = await cartManager.addProdToCart(cid,pid);
    res.send(resp)
    
})

router.put('/',async (req, res)=>{

    
    
})

router.delete('/',async (req, res)=>{

    
    
})