const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose'); // Keep MongoDB connection for future use
const cookieParser = require('cookie-parser');
const feedbackRoutes = require("./routes/feedbackRoutes")

const app = express();

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB conectado'))
    .catch((err) => console.error('Error al conectar MongoDB', err));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173', // Update this to match your frontend's URL
    })
);

// Routes
app.use('/', require('./routes/authRoutes')); // Authentication routes
app.use("/api/feedback", feedbackRoutes);

// Start the server
const port = 8000;
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));
