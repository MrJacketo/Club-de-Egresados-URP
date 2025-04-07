const bcrypt = require('bcrypt')

const hashPassword = (contraseña) => {
    return new Promise ((resolve,reject) => {
        bcrypt.genSalt(12, (err,salt) => {
            if(err) {
                reject(err)
            }
            bcrypt.hash(contraseña,salt,(err,hash) => {
                if(err) {
                    reject(err)
                }
                resolve(hash)
            })
        })
    }) 
}

const comparePassword = (contraseña,hashed) => {
    return bcrypt.compare(contraseña, hashed)
}

module.exports = {
    hashPassword,
    comparePassword
}