require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const localStatergy = require('passport-local').Strategy
const session = require('express-session')
const User = require('./models/user')
const { register } = require('./models/user')
//make an express app

app = express()
//configuring some basics
app.use(express.urlencoded({extended:false}))
//connect to mongodb
mongoose.connect('mongodb://127.0.0.1:27017/policemain').then(() => {
    console.log('connection opened to moongoose successfully')
}).catch((err) => {
    console.log('cannot open the connection because of ' + err)
})

// configure session

app.use(session(
    {
        secret: "hello world ",
        resave: true,
        saveUninitialized: false
    }
))

//configuring passport js

passport.use(new localStatergy(User.authenticate()))
app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser(User.serializeUser())
  passport.deserializeUser(User.deserializeUser())
  


//listening on port 3000

app.listen('3000', (err) => {
    if (err) {
        return err
    }
    else {
        console.log("server running successfully :)")
    }
    })


//register user
app.post('/register',async (req, res, next) => {
   var { username, password, email } = req.body
     user = new User({ username, email })
    registeredUser =await User.register(user, password, (err) => {
       
        req.login(registeredUser, (err) => {
            if (err) { res.send(err) }
            console.log('logged in :)')
            console.log()
        })     
    })
})

//user login
app.post('/login',passport.authenticate('local'), (req, res) => {

     
     res.send("login successful :)")
})
     

app.post('/loggedin', (req, res, next) => {
    
    if (req.isAuthenticated()) {
        res.send('yes, you are still logged in :) this shit works :)')
        console.log("you are still logged in")
       
    } else {
        res.send("you are not logged in")
        }
})

app.post('/logout',async (req, res, next) => {
    res.send('you are no longer logged in')
    await req.logout((err) => {
    console.log(err)
    })
})


