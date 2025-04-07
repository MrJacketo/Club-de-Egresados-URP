const User = require('../models/user');
const {hashPassword, comparePassword} = require('../helpers/auth');
const jwt = require('jsonwebtoken');

const test = (req,res) => {
    res.json('test esta funcionando')
}

const registerUser = async (req,res) => {
    try {
        const {nombre, email, contraseña} = req.body;
        //Revisar si nombre ha ingresado
        if(!nombre) {
            return res.json({
                error: 'Nombre es requerido'
            })
        };

        //Revisar si la contraseña ha ingresado
        if(!contraseña || contraseña.length < 6){
            return res.json({
                error: 'La contraseña es requerida y debe ser de al menos 6 caracteres'
            })
        };

        //Revisar si la correo ha ingresado
        if(!email){
            return res.json({
                error: 'El email es requerido'
            })
        };

        //Revisar si email ya existe
        const exist = await User.findOne({email});
        if(exist){
            return res.json({
                error: "Email ya registrado anteriormente"
            })
        }


        const hashedPassword = await hashPassword(contraseña)
        //Crea usuario en la base de datos
        const user = await User.create({
            nombre,email,contraseña: hashedPassword
        })

        return res.json(user)
    } catch (error) {
        console.log(error)
    }
}

const loginUser = async (req,res) => {
    try {
        const {email, contraseña} = req.body;

        //Revisar si el usuario existe
        const user = await User.findOne({email});
        if(!user) {
            return res.json({
                error: 'Correo no registrado'
            })
        }

        //Revisar si las contraseñas coinciden
        const coinciden = await comparePassword(contraseña, user.contraseña)

        if(coinciden) {
            jwt.sign({email: user.email, id: user._id, name: user.nombre}, process.env.JWT_SECRET, {} , (err, token) => {
                if(err) throw err;
                res.cookie('token', token).json(user)
            } )
        }
        if(!coinciden){
            return res.json({
                error: 'Contraseña incorrecta'
            })
        }
    } catch (error) {
        console.log(error)
    }

}

const getProfile = (req, res) => {
    const { token } = req.cookies;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if (err) throw err;
            res.json(user)
        })
    } else {
        res.json(null)
    }

    
};

module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile
}