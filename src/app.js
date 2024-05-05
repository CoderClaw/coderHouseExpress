import express from 'express';
import { __dirname} from './utils.js';
import prodRouter from './routes/products.router.js'
import cartRouter from './routes/carts.router.js'
import  viewsRouter  from './routes/view.router.js';
import handlebars from 'express-handlebars'
import { Server } from 'socket.io';
import mongoose from 'mongoose'

const app = express();

const httpServer = app.listen(8080, err =>{
    console.log("escuchando en puerto 8080")
})

const io = new Server(httpServer) 

try{
    mongoose.connect('mongodb+srv://coderhouseProject:noh5tzDPkuzeGwa8@cluster0.nqgyiqu.mongodb.net/ecommerce')
    console.log("db conectada")
}catch(error){
    console.log(error)
}


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'));

app.use(getIo(io))

app.set('view engine',"handlebars")

app.engine("handlebars", handlebars.engine())

app.set('views', __dirname + '/views');

app.use('/', viewsRouter);

app.use('/api/products',prodRouter)
app.use('/api/carts',cartRouter)



// io.on('connection',socket => {
//     console.log("nuevo cliente")

//     socket.on('message', data =>{
//         console.log(data)
//     })

//     socket.emit("socket_individual", "este mensaje solo lo debe recibir este socket")

//     socket.broadcast.emit("broadcast","para todos menos el actual")

//     io.emit("socketServer","este mensaje lo resiven todos")
// })

function getIo(io){
    return (req,res,next)=>{
        req.io = io
        next()
    }
}