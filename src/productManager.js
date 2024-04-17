import * as fs from 'fs';

export class ProductManager{
    products = [];
    jsonName = "/products.json"

    constructor(path){        
        this.path = path;
    }

    async addProduct(title,description,code,price,status=true,stock,category,thumbnails){  
        try{

            if(!fs.existsSync(this.path+this.jsonName)){                
                await fs.promises.writeFile(this.path+this.jsonName,"[]")
                await this.addProduct(title,description,code,price,status,stock,category,thumbnails)                
            }else{                
                const prod = await this.verifyProd(title,description,code,price,status,stock,category,thumbnails);                
                const productsList = await this.getProducts();
                productsList.push(prod);
                await fs.promises.writeFile(this.path+this.jsonName,JSON.stringify(productsList,null,'\t'));
            } 
        }catch(err){
            console.log(err.message)
            return err.message       
        }       
        
    }

    async verifyProd(title,description,code,price,status,stock,category,thumbnails){
        
        const prod = {
            id: await this.#nextId(),
            title,
            description,
            code,
            price,
            status,            
            stock,
            category,
            thumbnails
        }
        console.log(prod)
        const nullKeys = Object.keys(prod).filter(key=>{
            if(key!=="thumbnails"){
                return prod[key] == null || prod[key] == ""
            }
        })

        let invalidCode = false;
        
        const products = await this.getProducts();

        products.forEach((el)=>{
            if(el.code == prod.code) invalidCode = true;
        })        

        if(nullKeys.length>0 || invalidCode){
            console.error("Han ocurrido los siguientes errores: ")

            if(nullKeys.length>0){
                console.error("Debe completar los siguientes campos con valores válidos: " + nullKeys)
                throw new Error("Debe completar los siguientes campos con valores válidos: " + nullKeys)
            }

            if(invalidCode){
                console.error("Se ha proporcionado un código de producto ya existente. El valor del código de producto debe ser único.")
                throw new Error("Se ha proporcionado un código de producto ya existente. El valor del código de producto debe ser único.")
            }

            throw new Error('') //lo deje de esta manera para que salgan los dos errores en caso de existir los dos y tirar un solo error
        }else{
            return prod;
        }
    }

    async getProducts(){
        try{
            if(!fs.existsSync(this.path+this.jsonName)){
                console.log(!fs.existsSync(this.path+this.jsonName),this.path+this.jsonName)
                throw new Error("no se encontraron productos en la busqueda general");
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
            
            if(!productsList) throw new Error("No se encontraron productos en la busqueda por id")
            const prod = productsList.filter(item => item.id == id)
            
            if(await prod.length === 0) throw new Error("No se ha encontrado un producto con la id proporcionada")        
            
            return prod[0];
        }catch(err){
            console.log(err.message)
        }
        
    }

    async updateProduct(id,obj){
        try{
            
            const prod = await this.getProductById(id);
            
            if(prod){
                const updatedProd = {...prod,...obj}
            
                const productsList = await this.getProducts();
    
                const index = productsList.findIndex((el)=>el.id == id)
                
                productsList.splice(index,1,updatedProd)
                
                await fs.promises.writeFile(this.path+this.jsonName,JSON.stringify(productsList));
                console.log("Producto actualizado")
            }else{
                throw new Error("No se ha encontrado un producto con la id proporcionada")
            }
           
        }catch(err){
            console.log(err)
            return err.message
        }
        
    }

    async deleteProduct(id){
        try{
            const productsList = await this.getProducts();
            const index = productsList.findIndex((el)=>el.id == id)
            if(index === -1) throw new Error("No se ha encontrado un producto con la id proporcionada")           
            
             productsList.splice(index,1)             
             await fs.promises.writeFile(this.path+this.jsonName,JSON.stringify(productsList));
            console.log("Producto eliminado")
        }catch(err){
            console.log(err)
            return err.message
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
//  await productManager.addProduct("prod1","description","0000001",100,true,20,"category",[])
//  await productManager.addProduct("prod2","description","0000002",100,true,20,"category",[])
//  await productManager.addProduct("prod3","description","0000003",100,true,20,"category",[])
//  await productManager.addProduct("prod4","description","0000004",100,true,20,"category",[])
//  await productManager.addProduct("prod5","description","0000005",100,true,20,"category",[])
//  await productManager.addProduct("prod6","description","0000006",100,true,20,"category",[])
//  await productManager.addProduct("prod7","description","0000007",100,true,20,"category",[])
//  await productManager.addProduct("prod8","description","0000008",100,true,20,"category",[])
//  await productManager.addProduct("prod9","description","0000009",100,true,20,"category",[])
//  await productManager.addProduct("prod10","description","0000010",100,true,20,"category",[])


// //  console.log(await productManager.getProducts())

// //  console.log(await productManager.getProductById(3))

//     // await productManager.updateProduct(1,{        
//     // title:'prodChanged'           
//     // })

//     //await productManager.deleteProduct(2)
// })()





