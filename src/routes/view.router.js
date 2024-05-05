import { Router } from "express";
import { prodModel } from "../dao/models/Prod.js";
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
            products = await prodModel.find()
            socket.emit("getProd",JSON.stringify(products))
        })

        socket.on("delProd", async data=>{
            const id = parseInt(data);    
            console.log(id)
            const response = await prodModel.deleteOne(id)
            products = await prodModel.find()
            socket.emit("getProd",JSON.stringify(products))
        })
    })
    
   
})
    

export default router;