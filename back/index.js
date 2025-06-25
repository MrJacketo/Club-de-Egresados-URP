const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose'); // Keep MongoDB connection for future use
const cookieParser = require('cookie-parser');
const feedbackRoutes = require("./routes/feedbackRoutes")
const authRoutes = require("./routes/authRoutes");
const gestionNoticiasRoutes = require("./routes/gestionNoticiasRoutes"); // <--- Agrega esta línea


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
app.use(express.json({ limit: '10mb' })); // Aumenta el límite a 10mb para manejar imágenes en noticias
app.use(cookieParser());
app.use(express.urlencoded({ extended: false, limit: '10mb' })); // También aquí aumentamos el límite para formularios que envían imágenes
app.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173', // Update this to match your frontend's URL
    })
);

// Routes
app.use("/", authRoutes); // Authentication routes
app.use("/api/feedback", feedbackRoutes); // Feedback routes
app.use("/api/noticias", gestionNoticiasRoutes); // <--- Agrega esta línea


// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
const port = 8000;
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));
