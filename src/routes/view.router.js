import { Router } from "express";
import { ProductManager } from "../productManager.js";

const router = Router();

const productManager = new ProductManager("./files")
let products = await productManager.getProducts()

router.get('/', async (req, res) => {
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
    
    
    res.render('realtimeproducts', {
        products
    }  
    )

    io.on('connection',socket => {

        socket.emit("getProd",JSON.stringify(products))

        socket.on("addProd", async data=>{
            const {title,description,code,price,status,stock,category,thumbnails} = JSON.parse(data);    
            console.log(title,description,code,price,status,stock,category,thumbnails)
            const response = await productManager.addProduct(title,description,code,price,status,stock,category,thumbnails)
            products = await productManager.getProducts()
            socket.emit("getProd",JSON.stringify(products))
        })

        socket.on("delProd", async data=>{
            const id = parseInt(data);    
            console.log(id)
            const response = await productManager.deleteProduct(id)
            products = await productManager.getProducts()
            socket.emit("getProd",JSON.stringify(products))
        })
    })
    
   
})
    

export default router;