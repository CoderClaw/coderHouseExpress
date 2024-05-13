import { Router } from "express";
import { prodModel } from "../dao/models/Prod.js";
import { cartModel } from "../dao/models/Cart.js";
import { messageModel } from "../dao/models/Messages.js";
//import { ProductManager } from "../productManager.js";

const router = Router();

// const productManager = new ProductManager("./files")
// let products = await productManager.getProducts()

router.get('/', async (req, res) => {

    const products = await prodModel.find({}).lean()
    
    let nroProducts=0;
    if(products){
        nroProducts = products.length
    }

    res.render('home', {
        products,
        nroProducts,
    })
}); 

router.get('/products', async (req, res) => {

    let products = {};
    if(req.query.page){
        products = await prodModel.paginate({},{lean: true,limit:5,page:req.query.page})
    }else{
        products = await prodModel.paginate({},{lean: true,limit:5,page:1})
    }

    const respuesta = {
        status: "success",
        payload: products.docs,
        totalPages:products.totalDocs,
        prevPage: products.hasPrevPage ? products.page-1 : null,
        nextPage: products.hasNextPage ? products.page+1 : null ,
        page:products.page,
        hasPrevPage:products.hasPrevPage,
        hasNextPage:products.hasNextPage,
        prevLink:products.hasPrevPage ? "http://localhost:8080/products?page=" + (products.page-1) : null ,
        nextLink:products.hasNextPage ? "http://localhost:8080/products?page=" + (products.page+1) : null ,
    }
    
    res.render('products', {
        products,
        respuesta       
    })
}); 

router.post('/products', async (req, res) => {

    const {prodId} = req.body

    const cart = await cartModel.findOne({}).lean();

    if(!cart.products.find(obj => obj.product.toString() === prodId)){
        cart.products.push({
            product: prodId,
            quantity: 1
        })
    }else{
        const selectedCart = cart.products.findIndex(obj => obj.product.toString() === prodId)
        cart.products[selectedCart].quantity++
    }    
    

    await cartModel.findOneAndUpdate({_id:cart._id},cart).lean()
    
    const newCart = await cartModel.findById(cart._id).populate('products.product').lean();
   
    res.redirect('/carts/'+cart._id)
}); 

router.get('/carts/:cid', async (req, res) => {

    const {cid} = req.params; 
    try {
        
        const newCart = await cartModel.findById({_id:cid}).populate('products.product').lean();   

        res.render('cart', {
            newCart
        })
    } catch (error) {
        console.log(error.message)
    }
    
}); 

router.get('/realtimeproducts', async (req, res) => {
    
    const {io} = req  
    let products = await prodModel.find()
    
    res.render('realtimeproducts', {
        products
    })

    io.on('connection',socket => {

        socket.emit("getProd",JSON.stringify(products))

        socket.on("addProd", async data=>{
            const {title,description,code,price,status,stock,category,thumbnails} = JSON.parse(data);    
            
            const response = await prodModel.create({title,description,code,price,status: true,stock,category,thumbnails: "thumbnail"})
            products = await prodModel.find({})
            socket.emit("getProd",JSON.stringify(products))
        })

        socket.on("delProd", async data=>{
            try{                                         
                await prodModel.deleteOne({_id:data})
                products = await prodModel.find({})
                socket.emit("getProd",JSON.stringify(products))
            }catch(error){
                console.log(error.message)
            }
            
        })
    })
    
   
})

router.get("/chat", async (req,res)=>{

    const io = req.io

    let messages = await messageModel.find({}).lean()

    io.on('connection',socket=>{
        socket.on('message',async data=>{            
            await messageModel.create(data)
            messages = await messageModel.find({}).lean()
            io.emit("messageLog",messages)
        })
    })
    res.render('index',{})
})
    

export default router;