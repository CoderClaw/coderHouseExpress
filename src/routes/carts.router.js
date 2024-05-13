import { Router } from "express";
import { cartModel } from "../dao/models/Cart.js";
import { prodModel } from "../dao/models/Prod.js";

const router = new Router();

export default router;

// import { CartManager } from '../cartManager.js';
// const cartManager = new CartManager("./files")


router.get('/',async (req, res)=>{

    const carts = await cartModel.find({}).populate("products.product")
    
    if(req.query.limit){
        res.send(carts.slice(0,parseInt(req.query.limit)))
    }else{
        res.send(carts)
    }
    
})
router.get('/:cid',async (req, res)=>{
    const cart = await cartModel.findOne({_id: req.params.cid}).populate("products.product")

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
        
        if(!cart.products.find(obj => obj.product.toString() === prod._id.toString())){
            cart.products.push({
                product: pid,
                quantity: 1
            })
        }else{
            const selectedCart = cart.products.findIndex(obj => obj.product.toString() === prod._id.toString())
            cart.products[selectedCart].quantity++
        }
        
    
        const resp = await cartModel.findByIdAndUpdate({_id:cid},cart);
        res.send(resp)
    }catch(error){
        console.log(error)
    }
    
    
})

router.put('/:cid',async (req, res)=>{

    const {cid} = req.params;

    const cart = await cartModel.findById(cid).lean()

    cart.products = req.body;

    await cartModel.findByIdAndUpdate({_id: cid},cart)
    
    res.send(cart)
    
})

router.put('/:cid/products/:pid',async (req, res)=>{
    const {cid,pid} = req.params;

    const cart = await cartModel.findById(cid).lean()

    if(!cart){
        res.status(401).send("error, carrito no encontrado")
    }
    
    const prodIndex = cart.products.findIndex(prod=>prod.product == pid);
    if(prodIndex < 0){
        console.log(prodIndex)
        res.status(401).send("error, producto no encontrado en el carrito seleccionado")
    }else{
        cart.products[prodIndex].quantity = req.body.quantity;

        await cartModel.findByIdAndUpdate({_id: cid},cart)
        
        res.send(cart)
    }   
    
})

router.delete('/:cid',async (req, res)=>{

    const {cid} = req.params;

    const cart = await cartModel.findById(cid).lean()

    cart.products = []

    await cartModel.findByIdAndUpdate({_id: cid},cart)
    
    res.send(cart)
    
})

router.delete('/:cid/products/:pid',async (req, res)=>{

    const {cid,pid} = req.params;

    const cart = await cartModel.findById(cid).lean()

    cart.products = cart.products.filter(prod => prod.product != pid)

    await cartModel.findByIdAndUpdate({_id: cid},cart)
    
    res.send(cart)
    
})