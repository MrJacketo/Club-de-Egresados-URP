const mongoose = require('mongoose');
const Membresia = require('../models/Membresia');
const User = require('../models/User');
require('dotenv').config();

const cleanupMembresias = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/club-egresados');
    console.log('📡 Conectado a MongoDB');

    console.log('=== LIMPIANDO MEMBRESÍAS CON REFERENCIAS ROTAS ===');
    
    // Encontrar membresías con populate
    const membresias = await Membresia.find().populate('userId').lean();
    console.log(`Total membresías: ${membresias.length}`);

    // Identificar membresías con referencias rotas
    const membresiasRotas = membresias.filter(m => !m.userId || !m.userId._id);
    const membresiasValidas = membresias.filter(m => m.userId && m.userId._id);
    
    console.log(`Membresías con referencias rotas: ${membresiasRotas.length}`);
    console.log(`Membresías válidas: ${membresiasValidas.length}`);

    if (membresiasRotas.length > 0) {
      console.log('\n--- Membresías con referencias rotas ---');
      membresiasRotas.forEach((m, index) => {
        console.log(`${index + 1}. ID: ${m._id}, UserID: ${m.userId || 'NULL'}, Estado: ${m.estado}`);
      });

      // Preguntar si quiere eliminarlas (en producción, mejor hacer esto manualmente)
      console.log('\n¿Quieres eliminar las membresías con referencias rotas? (Comentar la siguiente línea para confirmar)');
      
      // DESCOMENTAR LA SIGUIENTE LÍNEA PARA ELIMINAR LAS MEMBRESÍAS ROTAS
      // const idsAEliminar = membresiasRotas.map(m => m._id);
      // const resultado = await Membresia.deleteMany({ _id: { $in: idsAEliminar } });
      // console.log(`✅ Se eliminaron ${resultado.deletedCount} membresías con referencias rotas`);
      
      console.log('⚠️ No se eliminaron las membresías rotas (línea comentada en el script)');
    }

    console.log('\n--- Membresías válidas ---');
    membresiasValidas.forEach((m, index) => {
      console.log(`${index + 1}. Usuario: ${m.userId.name} (${m.userId.email}), Estado: ${m.estado}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Conexión cerrada');
    process.exit(0);
  }
};

cleanupMembresias();