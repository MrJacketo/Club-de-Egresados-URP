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

const cleanupMigration = async () => {
  try {
    console.log('🧹 Limpiando migración anterior...');
    
    // Check if users_migrated exists
    const collections = await mongoose.connection.db.listCollections({ name: 'users_migrated' }).toArray();
    
    if (collections.length > 0) {
      await mongoose.connection.db.collection('users_migrated').drop();
      console.log('✅ Colección users_migrated eliminada');
    } else {
      console.log('ℹ️  No se encontró colección users_migrated');
    }
    
    // Clean up any backup collections if you want (optional)
    const allCollections = await mongoose.connection.db.listCollections().toArray();
    const backupCollections = allCollections.filter(col => col.name.startsWith('users_backup_'));
    
    if (backupCollections.length > 0) {
      console.log(`\n🗑️  Encontrados ${backupCollections.length} backups:`);
      for (const backup of backupCollections) {
        console.log(`   - ${backup.name}`);
      }
      console.log('\n❓ Si quieres eliminar los backups también, ejecuta:');
      console.log('   node migration/cleanupMigration.js deletebackups');
    }
    
    console.log('\n✅ Limpieza completada. Tu colección original "users" está intacta.');
    console.log('   Ahora puedes ejecutar la migración nuevamente si quieres.');
    
  } catch (error) {
    console.error('❌ Error durante limpieza:', error);
  }
};

const deleteBackups = async () => {
  try {
    console.log('🗑️  Eliminando backups...');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    const backupCollections = collections.filter(col => col.name.startsWith('users_backup_'));
    
    for (const backup of backupCollections) {
      await mongoose.connection.db.collection(backup.name).drop();
      console.log(`✅ Eliminado: ${backup.name}`);
    }
    
    console.log(`\n🎉 ${backupCollections.length} backups eliminados`);
    
  } catch (error) {
    console.error('❌ Error eliminando backups:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (command === 'deletebackups') {
    await deleteBackups();
  } else {
    await cleanupMigration();
  }
  
  mongoose.connection.close();
};

main().catch(console.error);