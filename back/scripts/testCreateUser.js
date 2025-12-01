const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const testCreateUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/club-egresados');
    console.log('📡 Conectado a MongoDB');

    const userData = {
      email: 'test-user@urp.edu.pe',
      password: 'test123',
      name: 'Usuario de Prueba',
      rol: 'egresado',
      anioEgreso: 2024,
      carrera: 'Ingeniería Informática',
      gradoAcademico: 'Egresado',
      activo: true
    };

    // Verificar si ya existe
    const existingUser = await User.findOne({ email: userData.email });
    
    if (existingUser) {
      console.log('⚠️ Eliminando usuario de prueba existente...');
      await User.deleteOne({ email: userData.email });
    }

    // Crear el nuevo usuario
    const newUser = new User(userData);
    await newUser.save();
    
    console.log('✅ Usuario de prueba creado exitosamente:');
    console.log(`   📧 Email: ${userData.email}`);
    console.log(`   👤 Nombre: ${userData.name}`);
    console.log(`   🎭 Rol: ${userData.rol}`);
    console.log(`   🔑 Contraseña: ${userData.password} (será hasheada automáticamente)`);
    console.log(`   🎓 Carrera: ${userData.carrera}`);
    console.log(`   📅 Año de Egreso: ${userData.anioEgreso}`);
    console.log(`   🏆 Grado Académico: ${userData.gradoAcademico}`);

  } catch (error) {
    console.error('❌ Error en prueba:', error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Conexión a MongoDB cerrada');
    process.exit(0);
  }
};

// Ejecutar el script
testCreateUser();