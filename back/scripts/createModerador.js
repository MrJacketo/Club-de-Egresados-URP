const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createModerador = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('📡 Conectado a MongoDB');

    // Datos del moderador
    const moderadorData = {
      email: 'moderador@urp.edu.pe',
      password: 'moderador123', // Será hasheado automáticamente por el modelo
      name: 'Moderador URP',
      rol: 'moderador',
      activo: true
    };

    // Verificar si ya existe un moderador con este email
    const existingModerador = await User.findOne({ email: moderadorData.email });
    
    if (existingModerador) {
      console.log('⚠️ Ya existe un usuario con el email:', moderadorData.email);
      console.log('Rol actual:', existingModerador.rol);
      
      // Preguntar si quiere actualizar el rol
      if (existingModerador.rol !== 'moderador') {
        existingModerador.rol = 'moderador';
        await existingModerador.save();
        console.log('✅ Rol actualizado a moderador para:', moderadorData.email);
      }
    } else {
      // Crear el nuevo moderador
      const newModerador = new User(moderadorData);
      await newModerador.save();
      
      console.log('✅ Moderador creado exitosamente!');
      console.log('📧 Email:', moderadorData.email);
      console.log('🔑 Contraseña:', 'moderador123');
      console.log('👤 Nombre:', moderadorData.name);
      console.log('🎭 Rol: moderador');
    }

    mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  } catch (error) {
    console.error('❌ Error creando moderador:', error);
    mongoose.connection.close();
  }
};

createModerador();
