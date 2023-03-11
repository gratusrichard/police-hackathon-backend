require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const passportLocal = require('passport-local').Strategy
const session = require('express-session')
const User = require('./models/user')
const { register } = require('./models/user')
//make an express app

app = express()
//configuring some basics
app.use(express.urlencoded({extended:false}))
//connect to mongodb
mongoose.connect('mongodb://127.0.0.1:27017/police_backend').then(() => {
    console.log('connection opened to moongoose successfully')
}).catch((err) => {
    console.log('cannot open the connection because of ' + err)
})

// configure session

app.use(session(
    {
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: false
    }
))

app.listen('3000', (err) => {
    if (err) {
        return err
    }
    else {
        console.log("server running successfully :)")
    }
    })

passport.use(new passportLocal(User.authenticate()))

app.post('/register',async (req, res, next) => {
   var { username, password, email } = req.body
     user = new User({ username, email })
    registeredUser =await User.register(user, password, (err) => {
       
        req.login(registeredUser, (err) => {
            if (err) { res.send(error) }
            res.send("logged in :)")
        })     
    })
})


app.post('/login',passport.authenticate('local', { 
    failureFlash: true,
     failureRedirect: '/user/login',
    successFlash: true}), (req,res)=> {

     req.flash('success', 'successfully logged in , welcome back :)')
     
     res.redirect('/bids/all')
        


     })