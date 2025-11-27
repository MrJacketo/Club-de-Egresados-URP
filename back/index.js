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
const moderacionRoutes = require("./routes/moderacionRoutes");
const publicacionesRoutes = require("./routes/publicacionesRoutes");



const ofertaModeradorRoutes = require("./routes/ofertaModeradorRoutes.js");
const conferenciaRoutes = require("./routes/conferenciaRoutes");
const incidenciasRoutes = require("./routes/incidenciasRoutes");
const inspeccionLaboralRoutes = require("./routes/inspeccionLaboralRoutes");

const app = express();
const path = require('path');
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error("Error al conectar MongoDB", err));

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      // Permitir cualquier origen que termine en :5173 o sea undefined (como Postman)
      if (!origin || origin.includes(':5173')) {
        callback(null, true);
      } else {
        callback(null, true); // Para desarrollo, permite todo
      }
    },
  })
);

// ← AGREGAR ESTA LÍNEA PARA SERVIR ARCHIVOS ESTÁTICOS

app.use('/api/noticias/imagen', express.static('uploads/noticias'));

// Routes
app.use("/auth", authRoutes);
app.use("/api", perfilRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/noticias", gestionNoticiasRoutes); // Noticias routes
app.use("/api/membresia", membresiaRoutes); //RUTAS MEMBRESIAS
app.use("/api/pago", pagoRoutes); //RUTA PAGOS
app.use("/api/beneficios", beneficiosRoutes); //RUTA BENEFICIOS
app.use("/api", ofertaRoutes); //Ruta de oferta laboral
app.use("/api/admin/users", adminUserRoutes); // Rutas de administración de usuarios
app.use("/api/conferencias", conferenciaRoutes); // Rutas de conferencias
app.use("/api/moderacion", moderacionRoutes); // Rutas de moderación
app.use("/api", publicacionesRoutes);

app.use("/api/moderador", ofertaModeradorRoutes); // Rutas de moderador
app.use("/api/incidencias", incidenciasRoutes); // Rutas de incidencias laborales
app.use("/api/inspeccion-laboral", inspeccionLaboralRoutes); // Rutas de inspección laboral


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
const port = 8000;
const host = '0.0.0.0'; // Permite conexiones desde cualquier IP

app.listen(port, host, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);

  // Mostrar IPs de la máquina actual
  const os = require('os');
  const interfaces = os.networkInterfaces();

  Object.keys(interfaces).forEach(name => {
    interfaces[name].forEach(iface => {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`   - http://${iface.address}:${port}`);
      }
    });
  });
});