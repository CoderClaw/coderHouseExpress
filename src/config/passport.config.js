import passport from "passport";
import local from "passport-local"
import GithubStrategy from "passport-github2"

import { UsersManagerMongo } from "../dao/usersManagerMongo.js";
import { createHash,isValidPassword } from "../bcrypt.js";

const LocalStrategy = local.Strategy
const userService = new UsersManagerMongo();


export const initPassport = () => {
    passport.use('register',new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done)=>{
        const { nombre, apellido } = req.body
        try {

            let userFound = await userService.getUserBy({email: username})
            if(userFound) return done(null,false)

            let newUser = {
                nombre,
                apellido,
                email: username,
                password: createHash(password)
            }

            let result = await userService.createUser(newUser)
            return done(null,result)

        } catch (error) {
            return done("error al registrar usuario ",error)
        }
    }))


    passport.use('login',new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done)=>{
        try {
            const user = await userService.getUserBy({email: username})
            if(!user) 
                done(null, false)

            if(!isValidPassword(password,{password: user.password}))
                return done(null,false)

            return done(null,user)

        } catch (error) {
            return done(error)
        }
    }))

    passport.use('github',new GithubStrategy({
        clientID:"Iv23liObHWNMBJD8QpaD",
        clientSecret:"d89566d8c1ae260891260fc1777681273ae37525",
        callbackURL:"http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done )=>{
        try {
            let user = await userService.getUserBy({email: profile._json.email})
            console.log(profile)
            if(!user){
                let newUser = {
                    nombre: profile._json.name,
                    apellido: profile._json.name,
                    email: profile._json.email,
                    password: "githubPassword"
                }
                if(!newUser.email)
                    newUser.email = profile._json.login+"@gmail.com" //todo: en el caso que no este visible el email
                let result = await userService.createUser(newUser)
                done(null,result)
            }else{
                done(null,user)
            }
        } catch (error) {
            console.log(error.message)
            return done(error.message,error)
        }
    }))

    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })

    passport.deserializeUser(async (id,done)=>{
       try {
            let user = await userService.getUserBy({_id:id})
            done(null,user)
       } catch (error) {
            done(SyntaxError)
       }
    })
}




