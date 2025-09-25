const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

const inspectUsers = async () => {
  try {
    console.log('🔬 INSPECCIÓN DETALLADA DE USUARIOS\n');
    
    // Get all users from main collection
    const users = await mongoose.connection.db.collection('users').find({}).limit(5).toArray();
    
    console.log(`📊 Total usuarios encontrados: ${users.length}\n`);
    
    users.forEach((user, index) => {
      console.log(`👤 USUARIO ${index + 1}:`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Email: ${user.email || 'N/A'}`);
      console.log(`   Name: ${user.name || user.nombre || 'N/A'}`);
      console.log(`   FirebaseUid: ${user.firebaseUid || 'NO'}`);
      console.log(`   Password: ${user.password ? 'SÍ (' + user.password.substring(0, 20) + '...)' : 'NO'}`);
      console.log(`   Contraseña: ${user.contraseña || 'NO'}`);
      console.log(`   CreatedAt: ${user.createdAt || user.fechaRegistro || 'N/A'}`);
      console.log(`   Campos disponibles: ${Object.keys(user).join(', ')}`);
      console.log('   ---\n');
    });
    
    // Count by specific criteria
    const totalUsers = await mongoose.connection.db.collection('users').countDocuments();
    const withFirebaseUid = await mongoose.connection.db.collection('users').countDocuments({ 
      firebaseUid: { $exists: true, $ne: null, $ne: "" } 
    });
    const withPassword = await mongoose.connection.db.collection('users').countDocuments({ 
      password: { $exists: true, $ne: null, $ne: "" } 
    });
    const withContraseña = await mongoose.connection.db.collection('users').countDocuments({ 
      contraseña: { $exists: true, $ne: null, $ne: "" } 
    });
    
    console.log('📈 ESTADÍSTICAS REALES:');
    console.log(`   Total: ${totalUsers}`);
    console.log(`   Con firebaseUid: ${withFirebaseUid}`);
    console.log(`   Con password: ${withPassword}`);
    console.log(`   Con contraseña: ${withContraseña}`);
    
    // Check backup collection
    try {
      const backupUsers = await mongoose.connection.db.collection('users_backup_1758673426077').countDocuments();
      console.log(`   En backup: ${backupUsers}`);
    } catch (error) {
      console.log('   Backup: No accesible');
    }
    
    console.log('\n💡 DIAGNÓSTICO:');
    if (withFirebaseUid > 0 && withPassword === 0) {
      console.log('   ✅ Usuarios necesitan migración de Firebase a JWT');
      console.log('   🔧 Ejecuta: node migration/migrateUsers.js migrate');
    } else if (withPassword > 0 && withFirebaseUid === 0) {
      console.log('   ✅ Usuarios ya están migrados a JWT');
    } else if (withFirebaseUid > 0 && withPassword > 0) {
      console.log('   ⚠️  Migración parcial - algunos usuarios tienen ambos');
    } else {
      console.log('   ❓ Situación inusual - revisar manualmente');
    }
    
  } catch (error) {
    console.error('❌ Error inspeccionando usuarios:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await inspectUsers();
  mongoose.connection.close();
};

main().catch(console.error);