const mongoose = require('mongoose');
const OfertaLaboral = require('../models/OfertaLaboral');
require('dotenv').config();

const testCreateOferta = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/club-egresados');
    console.log('📡 Conectado a MongoDB');

    const ofertaData = {
      cargo: 'Desarrollador Full Stack',
      empresa: 'TechCorp SAC',
      modalidad: 'Remoto',
      ubicacion: 'Lima, Perú',
      tipoContrato: 'Tiempo completo',
      descripcion: 'Desarrollador full stack con experiencia en React y Node.js',
      requisitos: 'Con experiencia', // Valor válido del enum
      area: 'Tecnología / IT',
      linkEmpresa: 'https://techcorp.com',
      salario: 3500,
      fechaCierre: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días desde hoy
      estado: 'Pendiente',
      aprobado: false
    };

    console.log('Creando oferta con datos:', ofertaData);

    const nuevaOferta = new OfertaLaboral(ofertaData);
    await nuevaOferta.save();
    
    console.log('✅ Oferta de prueba creada exitosamente:');
    console.log('   ID:', nuevaOferta._id);
    console.log('   Cargo:', nuevaOferta.cargo);
    console.log('   Empresa:', nuevaOferta.empresa);
    console.log('   Estado:', nuevaOferta.estado);

  } catch (error) {
    console.error('❌ Error en prueba:', error.message);
    if (error.name === 'ValidationError') {
      console.error('Errores de validación:');
      Object.values(error.errors).forEach(err => {
        console.error(`  - ${err.path}: ${err.message}`);
      });
    } else {
      console.error('Error completo:', error);
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Conexión a MongoDB cerrada');
    process.exit(0);
  }
};

// Ejecutar el script
testCreateOferta();