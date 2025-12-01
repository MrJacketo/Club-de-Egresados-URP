const mongoose = require('mongoose');
const { getAllMembresias } = require('../controllers/membresiaController');
require('dotenv').config();

const testGetAllMembresias = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/club-egresados');
    console.log('📡 Conectado a MongoDB');

    // Simular req y res
    const req = {};
    const res = {
      status: (code) => ({
        json: (data) => {
          console.log(`Status: ${code}`);
          console.log('Response data:');
          console.log(JSON.stringify(data, null, 2));
        }
      }),
      json: (data) => {
        console.log('Direct response:');
        console.log(JSON.stringify(data, null, 2));
      }
    };

    console.log('=== PROBANDO getAllMembresias ===');
    await getAllMembresias(req, res);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Conexión cerrada');
    process.exit(0);
  }
};

testGetAllMembresias();