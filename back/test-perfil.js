const mongoose = require('mongoose');
require('dotenv').config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI);

const PerfilEgresado = require('./models/PerfilEgresado');

const testProfileData = {
  userId: new mongoose.Types.ObjectId(), // Simular un ObjectId válido
  interesesProfesionales: {
    areasInteres: ["Innovación y tecnología"],
    modalidad: "Presencial",
    tipoJornada: "Tiempo completo",
  },
  habilidades: {
    idiomas: [{
      idioma: "Español",
      nivel: "Nativo"
    }],
  },
  ubicacion: {
    distritoResidencia: "Cercado de Lima",
    disponibilidadReubicacion: false,
    disponibilidadViajar: false,
  },
};

async function testProfileCreation() {
  try {
    console.log('Testing profile creation with data:', JSON.stringify(testProfileData, null, 2));
    
    const profile = new PerfilEgresado(testProfileData);
    
    // Test validation
    const validationError = profile.validateSync();
    if (validationError) {
      console.log('❌ Validation error:', validationError.message);
      console.log('Errors:', validationError.errors);
      return;
    }
    
    console.log('✅ Validation passed');
    
    // Try to save
    await profile.save();
    console.log('✅ Profile saved successfully:', profile._id);
    
    // Clean up
    await PerfilEgresado.findByIdAndDelete(profile._id);
    console.log('✅ Test profile deleted');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('Full error:', error);
  } finally {
    mongoose.connection.close();
  }
}

testProfileCreation();