const socket = io()

const prodContainer = document.querySelector("#prodContainer")

socket.on("getProd",data=>{
  const prods = JSON.parse(data)
  prodContainer.innerHTML = ""
  prods.forEach(item=>{
    let div = document.createElement("div")
    let h4 = document.createElement("h4")
    let p = document.createElement("p")
    h4.innerHTML = "prod name: " + item.title
    p.innerHTML = "prod id: " + item.id
    div.appendChild(h4)
    div.appendChild(p)
    prodContainer.appendChild(div)
  })

})



const addSubmit = document.getElementById("addSubmit")
const delSubmit = document.getElementById("delSubmit")


addSubmit.addEventListener("click",(ev)=>{
    ev.preventDefault()

    const title = document.getElementById("title").value
    const price = document.getElementById("price").value
    const code = document.getElementById("code").value
    const stock = document.getElementById("stock").value
    const description = document.getElementById("description").value
    const category = document.getElementById("category").value


    socket.emit("addProd", JSON.stringify({
                              title,
                              description,
                              code,
                              price,
                              status: true,
                              stock,
                              category,
                              thumbnails:[]
                            }))   

})
delSubmit.addEventListener("click",(ev)=>{
    ev.preventDefault()

    const id = document.getElementById("id").value

    socket.emit("delProd", id)   

})




/* 
<div class="product-container">
            {{#each products}}
            <div class="rtproduct">
                <h4>{{this.title}}</h4>
                <p>Id: {{this.id}}</p>
                <p>Precio: ${{this.price}}</p>
                <p>Code: {{this.code}}</p>
                <p>Stock: {{this.stock}}</p>
            </div>
            {{/each}}
        </div>
        <div>
            <form onsubmit="(ev)=>ev.preventDefault()">
                <h3>Agregar Producto:</h3>
                <div class="form-input">
                    <input type="text" placeholder="Titulo" id="title" name="title" required />
                    <input type="number" placeholder="Precio" id="price" name="price" required/>
                    <input type="number" placeholder="Código" id="code" name="code" required/>
                    <input type="number" placeholder="Stock" id="stock" name="stock" required/>
                    <input placeholder="Descripción" id="description" name="description" required/>
                    <input placeholder="Categoría" id="category" name="category" required/>
                </div>
                <div class="submit">
                    <button id="addSubmit">Agregar producto</button>
                </div>
            </form>

            <form onsubmit="(ev)=>ev.preventDefault()">
                <h3>Borrar Producto:</h3>
                <div class="form-input">
                    <input type="number" placeholder="Ingrese un Id" id="id" name="id" required />
                </div>
                <div class="submit" id="delSubmit">
                    <button >Borrar producto</button>
                </div>

            </form>
        </div>
*/




// socket.emit("message","mensaje desde el front")

// socket.on("socket_individual", data => {
//     console.log(data)
// })

// socket.on("broadcast", data => {
//     console.log(data)
// })

// socket.on("socketServer", data => {
//     console.log(data)
// })

