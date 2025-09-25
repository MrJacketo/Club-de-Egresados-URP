const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/club-egresados');
    console.log('Conectado a MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ rol: 'admin' });
    if (existingAdmin) {
      console.log('Ya existe un usuario administrador:', existingAdmin.email);
      console.log('Eliminando usuario existente para recrearlo...');
      await User.deleteOne({ rol: 'admin' });
    }

    // Create admin user
    const adminUser = new User({
      email: 'admin@urp.edu.pe',
      password: 'admin123', // This will be hashed automatically by the pre-save hook
      name: 'Administrador',
      rol: 'admin',
      activo: true
    });

    await adminUser.save();
    console.log('Usuario administrador creado exitosamente');
    console.log('Email: admin@urp.edu.pe');
    console.log('Contraseña: admin123');
    console.log('');
    console.log('IMPORTANTE: Cambia la contraseña después del primer login');

  } catch (error) {
    console.error('Error creando administrador:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin();