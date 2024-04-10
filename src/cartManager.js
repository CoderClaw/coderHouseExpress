import * as fs from 'fs';

import { ProductManager } from './productManager.js';
const productManager = new ProductManager("../files")

export class CartManager{
    carts = [];
    jsonName = "/carts.json"

    constructor(path){        
        this.path = path;
    }    

    async createCart(){
        try{

            if(!fs.existsSync(this.path+this.jsonName)){                
                await fs.promises.writeFile(this.path+this.jsonName,"[]")              
                await this.createCart()
                            
            }else{
                
                const newCart = {
                    id: await this.#nextId(),
                    products:[]
                }                               
                const cartList = await this.getCarts();
                cartList.push(newCart);
                await fs.promises.writeFile(this.path+this.jsonName,JSON.stringify(cartList,null,'\t'));
                return "se ha creado un nuevo carrito de id: " + newCart.id
            } 
        }catch(err){
            console.log(err.message)
            return "ocurrio un error inesperado"
        }
        
    }

    async getCarts(){
        try{
            if(!fs.existsSync(this.path+this.jsonName)){
                throw new Error("no se encontraron Carritos");
            }else{
                               
                const carts = await fs.promises.readFile(this.path+this.jsonName,'utf-8');
                const cartList = JSON.parse(carts);                
                
                return cartList;
            } 
        }catch(err){
            console.log(err.message)
        }    

    }

    async getCartById(id){
        try{
            const cartList = await this.getCarts();
            
            if(!cartList) throw new Error("No se encontraron carritos")
            const cart = cartList.filter(item => item.id == id)
            
            if(cart.length === 0) throw new Error("No se ha encontrado un carrito con la id proporcionada")        
            
            return cart[0];
        }catch(err){
            console.log(err.message)
        }
        
    }

    async addProdToCart(id,prodId){
        
        try{
            const carts = await this.getCarts();
            const cart = await this.getCartById(id);
            const prod = await productManager.getProductById(prodId);
            
            if(cart){
                
                if(prod){
                      
                    const cartProd = cart.products.filter(product=>product.product == prodId)
                         
                    if(cartProd.length === 0){
                        const newProd = {
                            product: parseInt(prodId),
                            quantity:1
                        }
                        
                        cart.products.push(newProd)
                                             
                    }else{
                        const newProd = {...cartProd[0],quantity:cartProd[0].quantity+1}                        
                        
                        const indexProd = cart.products.findIndex((el)=>el.product == prodId)            
                        cart.products.splice(indexProd,1,newProd)
                        
                    }
                    
                    const index = carts.findIndex((el)=>el.id == id)            
                    carts.splice(index,1,cart)                                      
                    await fs.promises.writeFile(this.path+this.jsonName,JSON.stringify(carts));
                    console.log("Carrito actualizado")
                }else{
                    throw new Error("Id de producto incorrecto")
                }
            }else{
                throw new Error("Id de carrito incorrecto")
            }
            
            return await this.getCartById(id);
            
        }catch(err){
            console.log(err)
            return err.message;
        }


    }

    // async updateCart(id,obj){
    //     try{
    //         const cart = await this.getCartById(id);
    //         const updatedCart = {...cart,...obj}
    //         const cartList = await this.getCarts();

    //         const index = cartList.findIndex((el)=>el.id === id)
            
    //         cartList.splice(index,1,updatedCart)
             
    //          await fs.promises.writeFile(this.path+this.jsonName,JSON.stringify(cartList));
    //          console.log("Producto actualizado")
    //     }catch(err){
    //         console.log(err)
    //     }
        
    // }

    // async deleteProduct(id){
    //     try{
    //         const cartList = await this.getCarts();
    //         const index = cartList.findIndex((el)=>el.id === id)
    //         if(index === -1) throw new Error("No se ha encontrado un producto con la id proporcionada")           
            
    //         cartList.splice(index,1)             
    //          await fs.promises.writeFile(this.path+this.jsonName,JSON.stringify(cartList));
    //         console.log("Carrito eliminado")
    //     }catch(err){
    //         console.log(err)
    //     }
        
    // }


    async #nextId(){
        try{
            const cartList = await this.getCarts();
            
            if(cartList.length === 0){
                return 1;
            }else{               
                return cartList.at(-1).id +1;
            }
        }catch(err){
            throw new Error(err)
        }
        

     }
}   

const cartManager = new CartManager("../files");




//TESTS

(async function(){
//  await cartManager.createCart()
//  await cartManager.createCart()
//  await cartManager.createCart()
 //console.log(await cartManager.getCartById(2))
})()