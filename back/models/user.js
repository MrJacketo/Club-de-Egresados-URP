const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
    nombre: String,
    email: {
        type: String,
        unique: true
    },
    contraseña: String
})

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel;