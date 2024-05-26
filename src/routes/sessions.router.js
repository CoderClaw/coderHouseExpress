// session -> login - register - logout
import {Router} from 'express'
import { UsersManagerMongo } from '../dao/usersManagerMongo.js'
import { auth } from '../middlewares/auth.middleware.js';

const userService = new UsersManagerMongo();

export const sessionsRouter = Router()

sessionsRouter.post('/login', async (req, res) => {
    const {email, password} = req.body
    //validar datos

    if(!email || !password){
        res.status(401).send('debe ingresar todos los datos')
    }

    if(email === "adminCoder@coder.com" && password === "adminCod3r123"){
        req.session.user = {
            email,
            admin: 'admin'
        }
        res.redirect('../../products')
    }else{
        try {
            const userFound = await userService.getUserBy({email})
    
            if (!userFound){
                return res.status(401).send("el usuario no existe")
            }else{
                req.session.user = {
                    email,
                    admin: userFound.role === 'admin'
                }
    
                res.redirect('../../products')
            }        
    
        } catch (error) {
            console.log(error.message)
            res.send('Ocurrio un error inesperado')
        }  
    } 
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

sessionsRouter.post('/register', async (req, res) => {
    const {Nombre, Apellido, email, password} = req.body

    //validar datos

    if(!email || !password){
        res.status(401).send('debe ingresar todos los datos')
    }

    try {
        //validamos si el usuario existe
        const userExist = await userService.getUserBy({email})

        if(userExist){
            res.status(401).send('el usuario ya existe')
        }

        let newUser = {Nombre, Apellido, email, password}

        const result = await userService.createUser(newUser)

        res.redirect('../../login')
        console.log(result)
    } catch (error) {
        res.status(401).send("ocurrio un error inesperado")
        console.log(error.message)
    }
    

    
})