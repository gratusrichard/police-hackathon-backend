const mongoose = require('mongoose')
const passportLocalMoongoose = require('passport-local-mongoose')

const schema = mongoose.Schema



const user = new schema({
    email: {
        type: String,
        
    }
})

user.plugin(passportLocalMoongoose)

module.exports = mongoose.model('User', user)