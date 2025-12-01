const mongoose = require('mongoose');
const Membresia = require('../models/Membresia');
const User = require('../models/User');
require('dotenv').config();

const checkMembresias = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/club-egresados');
    console.log('📡 Conectado a MongoDB');

    // Verificar membresías en la base de datos
    console.log('=== VERIFICANDO MEMBRESÍAS ===');
    const membresias = await Membresia.find().lean();
    console.log(`Total membresías en BD: ${membresias.length}`);
    
    membresias.forEach((m, index) => {
      console.log(`\nMembresía ${index + 1}:`);
      console.log(`  ID: ${m._id}`);
      console.log(`  UserID: ${m.userId}`);
      console.log(`  Estado: ${m.estado}`);
      console.log(`  Fecha Activación: ${m.fechaActivacion}`);
      console.log(`  Fecha Vencimiento: ${m.fechaVencimiento}`);
      console.log(`  Creada: ${m.createdAt}`);
    });

    // Verificar usuarios
    console.log('\n=== VERIFICANDO USUARIOS ===');
    const usuarios = await User.find().lean();
    console.log(`Total usuarios en BD: ${usuarios.length}`);

    // Intentar la consulta del controlador
    console.log('\n=== EJECUTANDO CONSULTA DEL CONTROLADOR ===');
    const membresiasConUsuarios = await Membresia.find().populate('userId', 'name email').lean();
    console.log(`Membresías con populate: ${membresiasConUsuarios.length}`);

    membresiasConUsuarios.forEach((m, index) => {
      console.log(`\nMembresía ${index + 1}:`);
      console.log(`  ID: ${m._id}`);
      console.log(`  Usuario: ${m.userId ? JSON.stringify(m.userId) : 'NULL'}`);
      console.log(`  Estado: ${m.estado}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Conexión cerrada');
    process.exit(0);
  }
};

checkMembresias();