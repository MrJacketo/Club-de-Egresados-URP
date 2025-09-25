// Script alternativo para crear administrador
// Puedes ejecutar este código directamente en la consola de tu aplicación

const createAdminManual = async () => {
  const User = require('./models/User');
  
  try {
    // Verificar si ya existe un admin
    const existingAdmin = await User.findOne({ rol: 'admin' });
    if (existingAdmin) {
      console.log('Ya existe un administrador:', existingAdmin.email);
      return;
    }

    // Crear nuevo usuario admin
    const adminUser = new User({
      email: 'admin@urp.edu.pe',
      password: 'admin123',
      name: 'Administrador',
      rol: 'admin',
      activo: true
    });

    const savedAdmin = await adminUser.save();
    console.log('Administrador creado:', savedAdmin.email);
    return savedAdmin;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Si quieres ejecutarlo ahora:
// createAdminManual();

module.exports = createAdminManual;