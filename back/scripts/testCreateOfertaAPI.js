const mongoose = require('mongoose');
const User = require('../models/User');
const OfertaLaboral = require('../models/OfertaLaboral');
const PublicacionOfertas = require('../models/PublicacionOfertas');
require('dotenv').config();

const testCreateOfertaAPI = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/club-egresados');
    console.log('📡 Conectado a MongoDB');

    // Buscar un usuario administrador existente
    const adminUser = await User.findOne({ rol: 'admin' });
    if (!adminUser) {
      console.error('❌ No se encontró un usuario administrador');
      return;
    }

    console.log('👤 Usuario encontrado:', adminUser.email);

    // Datos de la oferta como los enviaría el frontend
    const ofertaData = {
      cargo: 'Backend Developer',
      empresa: 'TestCompany Inc',
      modalidad: 'Híbrido',
      ubicacion: 'Lima, Perú',
      tipoContrato: 'Tiempo completo',
      descripcion: 'Desarrollador backend con experiencia en Node.js y bases de datos',
      requisitos: 'Con experiencia', // Valor válido del enum
      area: 'Tecnología / IT',
      linkEmpresa: 'https://testcompany.com',
      salario: 4000,
      fechaCierre: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días desde hoy
    };

    console.log('📝 Datos de la oferta:', ofertaData);

    // Simular la lógica del controlador
    console.log('🔄 Simulando creación de oferta...');

    // Limpiar campos opcionales que vienen vacíos
    const cleanedOfertaData = { ...ofertaData };
    
    if (!cleanedOfertaData.requisitos || cleanedOfertaData.requisitos.trim() === '') {
      delete cleanedOfertaData.requisitos;
    }
    
    if (!cleanedOfertaData.area || cleanedOfertaData.area.trim() === '') {
      delete cleanedOfertaData.area;
    }

    // Crear la nueva oferta con valores por defecto
    const nuevaOfertaData = {
      ...cleanedOfertaData,
      estado: cleanedOfertaData.estado || 'Pendiente',
      aprobado: cleanedOfertaData.aprobado || false
    };

    // Crear la oferta
    const nuevaOferta = new OfertaLaboral(nuevaOfertaData);
    await nuevaOferta.save();

    // Crear la publicación
    const nuevaPublicacion = new PublicacionOfertas({
      ofertaLaboral: nuevaOferta._id,
      perfil: adminUser._id
    });
    await nuevaPublicacion.save();

    console.log('✅ Oferta creada exitosamente:');
    console.log('   ID:', nuevaOferta._id);
    console.log('   Cargo:', nuevaOferta.cargo);
    console.log('   Empresa:', nuevaOferta.empresa);
    console.log('   Estado:', nuevaOferta.estado);
    console.log('   Requisitos:', nuevaOferta.requisitos);
    console.log('   Publicación ID:', nuevaPublicacion._id);

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
testCreateOfertaAPI();