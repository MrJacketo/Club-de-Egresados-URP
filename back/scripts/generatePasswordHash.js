const bcrypt = require('bcryptjs');

const generatePasswordHash = async () => {
  try {
    const password = 'admin123';
    const saltRounds = 12;
    
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    console.log('Contraseña original:', password);
    console.log('Hash generado:', hashedPassword);
    console.log('');
    console.log('Actualiza el documento en MongoDB con este hash:');
    console.log(`db.users.updateOne(
      { email: "admin@urp.edu.pe" },
      { $set: { password: "${hashedPassword}" } }
    )`);
    
    // Verificar que funciona
    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log('');
    console.log('Verificación del hash:', isValid ? '✅ Correcto' : '❌ Error');
    
  } catch (error) {
    console.error('Error:', error);
  }
};

generatePasswordHash();