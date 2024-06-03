import express from 'express';
import { __dirname} from './utils.js';
import prodRouter from './routes/products.router.js'
import cartRouter from './routes/carts.router.js'
import  viewsRouter  from './routes/view.router.js';
import { sessionsRouter } from './routes/sessions.router.js';
import handlebars from 'express-handlebars'
import { Server } from 'socket.io';
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { initPassport } from './config/passport.config.js';





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
app.use(cookieParser("Firma_Secreta"));



app.use(session({
    store: MongoStore.create({
        mongoUrl:'mongodb+srv://coderhouseProject:noh5tzDPkuzeGwa8@cluster0.nqgyiqu.mongodb.net/ecommerce',
        ttl:60 * 60 * 1000 * 24
    }),
    secret: 'secret',// firmar nuestro session
    resave: true,
    saveUninitialized: true
}));
initPassport()
app.use(passport.initialize())
app.use(passport.session())

app.use(getIo(io))

app.set('view engine',"handlebars")

app.engine("handlebars", handlebars.engine())

app.set('views', __dirname + '/views');

app.use('/', viewsRouter)

app.use('/api/products',prodRouter)
app.use('/api/carts',cartRouter)
app.use('/api/sessions', sessionsRouter)


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