// session -> login - register - logout
import {Router} from 'express'
import { UsersManagerMongo } from '../dao/usersManagerMongo.js'
import { auth } from '../middlewares/auth.middleware.js';
import {createHash, isValidPassword } from '../bcrypt.js'
import passport from 'passport';


const userService = new UsersManagerMongo();

export const sessionsRouter = Router()

sessionsRouter.post("/register",passport.authenticate("register",{failureRedirect:"/api/sessions/failRegister"}),(req,res)=>{
    res.send({status: "success", message: "User registered"})
})
sessionsRouter.get("/failRegister",(req,res)=>{
    res.send({status: "Error", message: "usuario no registrado"})
})

sessionsRouter.post("/login",passport.authenticate("login",{failureRedirect:"/api/sessions/failLogin"}),(req,res)=>{
    if(!req.user)
        return res.status(400).send({status: "error", error: "credenciales invalidad"})

    req.session.user = {
        nombre: req.user.nombre,
        apellido: req.user.apellido,
        email: req.user.email
    }

    res.send({status: "success", payload: req.user})
})

sessionsRouter.get("/failLogin",(req,res)=>{
    res.send({status: "success", message: "User not found"})
})

sessionsRouter.get('/current', auth, (req,res)=>{
    res.send("usuario admin")
})

sessionsRouter.get('/logout', (req, res) => {
    req.session.destroy( err => {
        if(err) return res.send({status: 'error', error: err})
        else return res.redirect('../../login')
    })
})

sessionsRouter.get("/github",passport.authenticate("github",{scope:"user:email"}),(req,res)=>{
    

    res.send({status: "success"})
})

sessionsRouter.get("/githubcallback",passport.authenticate("github",{failureRedirect:"/api/sessions/login"}),(req,res)=>{
    
    req.session.user = req.user;
    res.redirect("/products")
})


// sessionsRouter.post('/register', async (req, res) => {
//     const {Nombre, Apellido, email, password} = req.body

//     //validar datos

//     if(!email || !password){
//         res.status(401).send('debe ingresar todos los datos')
//     }

//     try {
//         //validamos si el usuario existe
//         const userExist = await userService.getUserBy({email})

//         if(userExist){
//             res.status(401).send('el usuario ya existe')
//         }

//         let newUser = {
//                         Nombre,
//                         Apellido,
//                         email,
//                         password: createHash(password)
//                         }

//         const result = await userService.createUser(newUser)

//         res.redirect('../../login')
//         console.log(result)
//     } catch (error) {
//         res.status(401).send("ocurrio un error inesperado")
//         console.log(error)
//     }
    

    
// })

// sessionsRouter.post('/login', async (req, res) => {
//     const {email, password} = req.body
//     //validar datos

//     if(!email || !password){
//         res.status(401).send('debe ingresar todos los datos')
//     }

//     if(email === "adminCoder@coder.com" && password === "adminCod3r123"){
//         req.session.user = {
//             email,
//             admin: 'admin'
//         }
//         res.redirect('../../products')
//     }else{
//         try {
//             const userFound = await userService.getUserBy({email})
    
//             if (!userFound){
//                 return res.status(401).send("el usuario no existe")
//             }else{

//                 const isValid = isValidPassword(password, { password: userFound.password} )

//                 if(!isValid){
//                     return res.status(401).send({status:error, error: "Incorrect Password"})
//                 }

//                 req.session.user = {
//                     email,
//                     admin: userFound.role === 'admin'
//                 }
    
//                 res.redirect('../../products')
//             }        
    
//         } catch (error) {
//             console.log(error.message)
//             res.send('Ocurrio un error inesperado')
//         }  
//     } 
// })