const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

const reviewMigration = async () => {
  try {
    console.log('🔍 Revisando estado de la migración...\n');
    
    // Check original users
    const originalUsers = await mongoose.connection.db.collection('users').countDocuments();
    const originalWithFirebase = await mongoose.connection.db.collection('users').countDocuments({ firebaseUid: { $exists: true, $ne: null } });
    const originalWithPassword = await mongoose.connection.db.collection('users').countDocuments({ password: { $exists: true, $ne: null } });
    
    console.log('📊 COLECCIÓN ORIGINAL (users):');
    console.log(`   Total usuarios: ${originalUsers}`);
    console.log(`   Con firebaseUid: ${originalWithFirebase}`);
    console.log(`   Con password: ${originalWithPassword}`);
    
    // Check migrated users if exists
    try {
      const migratedUsers = await mongoose.connection.db.collection('users_migrated').countDocuments();
      const migratedWithPassword = await mongoose.connection.db.collection('users_migrated').countDocuments({ password: { $exists: true } });
      const migratedNeedReset = await mongoose.connection.db.collection('users_migrated').countDocuments({ needsPasswordReset: true });
      
      console.log('\n📊 COLECCIÓN MIGRADA (users_migrated):');
      console.log(`   Total usuarios: ${migratedUsers}`);
      console.log(`   Con password: ${migratedWithPassword}`);
      console.log(`   Necesitan reset password: ${migratedNeedReset}`);
    } catch (error) {
      console.log('\n📊 COLECCIÓN MIGRADA (users_migrated):');
      console.log('   No existe aún (ejecuta migración primero)');
    }
    
    // Check backup collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    const backupCollections = collections.filter(col => col.name.startsWith('users_backup_'));
    
    console.log('\n📦 BACKUPS DISPONIBLES:');
    if (backupCollections.length === 0) {
      console.log('   Ningún backup encontrado');
    } else {
      for (const backup of backupCollections) {
        const count = await mongoose.connection.db.collection(backup.name).countDocuments();
        console.log(`   ${backup.name}: ${count} usuarios`);
      }
    }
    
    // Sample original users
    console.log('\n👥 MUESTRA DE USUARIOS ORIGINALES:');
    const sampleOriginal = await mongoose.connection.db.collection('users').find({}).limit(3).toArray();
    sampleOriginal.forEach((user, index) => {
      console.log(`   ${index + 1}. Email: ${user.email || 'N/A'} | FirebaseUid: ${user.firebaseUid ? `SÍ (${user.firebaseUid.substring(0, 10)}...)` : 'NO'} | Password: ${user.password ? 'SÍ' : 'NO'} | Name: ${user.name || user.nombre || 'N/A'}`);
    });
    
    // Sample migrated users if exists
    try {
      console.log('\n👥 MUESTRA DE USUARIOS MIGRADOS:');
      const sampleMigrated = await mongoose.connection.db.collection('users_migrated').find({}).limit(3).toArray();
      sampleMigrated.forEach((user, index) => {
        console.log(`   ${index + 1}. Email: ${user.email || 'N/A'} | FirebaseUid: ${user.firebaseUid ? 'SÍ' : 'NO'} | Password: ${user.password ? 'SÍ' : 'NO'}`);
      });
    } catch (error) {
      console.log('\n👥 MUESTRA DE USUARIOS MIGRADOS:');
      console.log('   Colección no existe aún');
    }
    
    // Recommendations
    console.log('\n💡 RECOMENDACIONES:');
    if (originalWithFirebase > 0 && originalWithPassword === 0) {
      console.log('   ✅ Ejecuta: node migrateUsers.js migrate');
    } else if (originalWithPassword > 0) {
      console.log('   ⚠️  Ya tienes usuarios con password. Migración podría no ser necesaria.');
    }
    
  } catch (error) {
    console.error('❌ Error revisando migración:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await reviewMigration();
  mongoose.connection.close();
};

main().catch(console.error);