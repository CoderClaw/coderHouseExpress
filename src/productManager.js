//const fs = require("fs");
import * as fs from 'fs';

export class ProductManager{
    products = [];
    jsonName = "/products.json"

    constructor(path){        
        this.path = path;
    }

    async addProduct(title,description,price,thumbnail,code,stock){  
        try{

            if(!fs.existsSync(this.path+this.jsonName)){                
                await fs.promises.writeFile(this.path+this.jsonName,"[]")
                this.addProduct(title,description,price,thumbnail,code,stock)                
            }else{                
                const prod = await this.verifyProd(title,description,price,thumbnail,code,stock);                
                const productsList = await this.getProducts();
                productsList.push(prod);
                await fs.promises.writeFile(this.path+this.jsonName,JSON.stringify(productsList,null,'\t'));
            } 
        }catch(err){
            console.log(err.message)
        }
        
    }

    async verifyProd(title,description,price,thumbnail,code,stock){
        
        const prod = {
            id: await this.#nextId(),
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        const nullKeys = Object.keys(prod).filter(key=>{
           return prod[key] == null || prod[key] == ""
        })

        let invalidCode = false;
        
        const products = await this.getProducts();

        products.forEach((el)=>{
            if(el.code == prod.code) invalidCode = true;
        })        

        if(nullKeys.length>0 || invalidCode){
            console.error("Han ocurrido los siguientes errores: ")

            if(nullKeys.length>0)console.error("Debe completar los siguientes campos con valores válidos: " + nullKeys)

            if(invalidCode)console.error("Se ha proporcionado un código de producto ya existente. El valor del código de producto debe ser único.")

            throw new Error('') //lo deje de esta manera para que salgan los dos errores en caso de existir los dos y tirar un solo error
        }else{
            return prod;
        }
    }

    async getProducts(){
        try{
            if(!fs.existsSync(this.path+this.jsonName)){
                throw new Error("no se encontraron productos");
            }else{
                               
                const products = await fs.promises.readFile(this.path+this.jsonName,'utf-8');
                const productsList = JSON.parse(products);                
                
                return productsList;
            } 
        }catch(err){
            console.log(err.message)
        }    

    }

    async getProductById(id){
        try{
            const productsList = await this.getProducts();
            
            if(!productsList) throw new Error("No se encontraron productos")
            const prod = productsList.filter(item => item.id === id)
            
            if(prod.length === 0) throw new Error("No se ha encontrado un producto con la id proporcionada")        
            
            return prod[0];
        }catch(err){
            console.log(err.message)
        }
        
    }

    async updateProduct(id,obj){
        try{
            const prod = await this.getProductById(id);
            const updatedProd = {...prod,...obj}
            const productsList = await this.getProducts();

            const index = productsList.findIndex((el)=>el.id === id)
            
             productsList.splice(index,1,updatedProd)
             
             await fs.promises.writeFile(this.path+this.jsonName,JSON.stringify(productsList));
             console.log("Producto actualizado")
        }catch(err){
            console.log(err)
        }
        
    }

    async deleteProduct(id){
        try{
            const productsList = await this.getProducts();
            const index = productsList.findIndex((el)=>el.id === id)
            if(index === -1) throw new Error("No se ha encontrado un producto con la id proporcionada")           
            
             productsList.splice(index,1)             
             await fs.promises.writeFile(this.path+this.jsonName,JSON.stringify(productsList));
            console.log("Producto eliminado")
        }catch(err){
            console.log(err)
        }
        
    }


    async #nextId(){
        try{
            const productsList = await this.getProducts();

            if(productsList.length === 0){
                return 1;
            }else{
               
                return productsList.at(-1).id +1;
            }
        }catch(err){
            console.log(err)
        }
        

    }
}   

const productManager = new ProductManager("../files");




//TESTS

// (async function(){
//  await productManager.addProduct("prod1","description",100,"thumbnail","lsdkffdasdfsfdAD",20)
//  await productManager.addProduct("prod2","description",200,"thumbnail","lsdkffdaagsgsadg",20)
//  await productManager.addProduct("prod3","description",300,"thumbnail","lsdkffdasgadsgsfdAD",20)
//  await productManager.addProduct("prod4","description",400,"thumbnail","lsdkffdsdgsdgsgdfweAD",20)
//  await productManager.addProduct("prod5","description",500,"thumbnail","lsdkffdawerghhyhAD",20)

// //  console.log(await productManager.getProducts())

// //  console.log(await productManager.getProductById(3))

//     // await productManager.updateProduct(1,{        
//     // title:'prodChanged'           
//     // })

//     //await productManager.deleteProduct(2)
// })()





