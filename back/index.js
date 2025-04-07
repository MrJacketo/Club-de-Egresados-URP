const express = require('express');
const dotenv = require('dotenv').config()
const cors = require('cors')
const { mongoose } = require('mongoose')
const cookieParser = require('cookie-parser')
const app = express();


// conexion a la base de datos
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error al conectar MongoDB', err));

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}))

app.use('/', require('./routes/authRoutes'))

const port = 8000;
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`))