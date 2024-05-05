import { Router } from "express";
import { prodModel } from "../dao/models/Prod.js";
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