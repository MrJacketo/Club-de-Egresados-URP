const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const perfilRoutes = require("./routes/perfilRoutes");
const membresiaRoutes = require("./routes/membresiaRoutes");
const pagoRoutes = require('./routes/pagoRoutes');
const beneficiosRoutes = require('./routes/gestionarBeneficiosRoutes');
const feedbackRoutes = require("./routes/feedbackRoutes");
const gestionNoticiasRoutes = require("./routes/gestionNoticiasRoutes");
const ofertaRoutes = require("./routes/ofertaRoutes.js");
const adminUserRoutes = require("./routes/userRoutes");
const conferenciaRoutes = require("./routes/conferenciaRoutes"); // NUEVA LÍNEA

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error("Error al conectar MongoDB", err));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

// Routes
app.use("/auth", authRoutes);
app.use("/api", perfilRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/noticias", gestionNoticiasRoutes);
app.use("/api/membresia", membresiaRoutes);
app.use("/api/pago", pagoRoutes);
app.use("/api/beneficios", beneficiosRoutes);
app.use("/api", ofertaRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/conferencias", conferenciaRoutes); // NUEVA LÍNEA

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
const port = 8000;
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));