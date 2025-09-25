const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

// Define User schema (old format with firebaseUid)
const OldUserSchema = new mongoose.Schema({
  firebaseUid: String,
  name: String,
  email: String,
  // other fields...
}, { strict: false }); // Allow flexible schema

const OldUser = mongoose.model('OldUser', OldUserSchema, 'users'); // Use existing 'users' collection

// Define New User schema (JWT format)
const NewUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  // other fields will be preserved
}, { strict: false });

const NewUser = mongoose.model('NewUser', NewUserSchema, 'users_migrated'); // Temporary collection

const migrateUsers = async () => {
  try {
    console.log('🚀 Iniciando migración de usuarios...');
    
    // Get all users with firebaseUid
    const oldUsers = await OldUser.find({ firebaseUid: { $exists: true } });
    console.log(`📊 Encontrados ${oldUsers.length} usuarios para migrar`);
    
    if (oldUsers.length === 0) {
      console.log('ℹ️  No hay usuarios con firebaseUid para migrar');
      return;
    }

    // Default temporary password (users will need to reset)
    const tempPassword = 'TempPass123!';
    const saltRounds = 12;
    const hashedTempPassword = await bcrypt.hash(tempPassword, saltRounds);
    
    let migratedCount = 0;
    let errorCount = 0;

    for (const user of oldUsers) {
      try {
        // Create new user object without firebaseUid
        const userData = user.toObject();
        delete userData.firebaseUid; // Remove firebaseUid
        delete userData._id; // Let MongoDB generate new _id
        
        // Add required fields for JWT
        userData.password = hashedTempPassword;
        userData.migratedAt = new Date();
        userData.needsPasswordReset = true; // Flag to indicate password reset needed
        
        // Ensure email and name exist
        if (!userData.email || !userData.name) {
          console.log(`⚠️  Usuario sin email o name, saltando: ${userData.email || 'sin email'}`);
          errorCount++;
          continue;
        }

        // Save to temporary collection first
        const newUser = new NewUser(userData);
        await newUser.save();
        
        migratedCount++;
        console.log(`✅ Migrado: ${userData.email}`);
        
      } catch (error) {
        errorCount++;
        console.log(`❌ Error migrando ${user.email || 'usuario sin email'}:`, error.message);
      }
    }

    console.log(`\n📈 Migración completada:`);
    console.log(`✅ Usuarios migrados exitosamente: ${migratedCount}`);
    console.log(`❌ Usuarios con errores: ${errorCount}`);
    console.log(`📝 Contraseña temporal para todos: ${tempPassword}`);
    console.log(`\n⚠️  IMPORTANTE: Los usuarios migrados están en la colección 'users_migrated'`);
    console.log(`   Revisa los datos y luego ejecuta 'replaceOriginalUsers()' para reemplazar la colección original.`);
    
  } catch (error) {
    console.error('💥 Error durante la migración:', error);
  }
};

// Function to replace original collection with migrated data
const replaceOriginalUsers = async () => {
  try {
    console.log('🔄 Reemplazando colección original...');
    
    // Backup original collection
    const backupCollectionName = `users_backup_${Date.now()}`;
    await mongoose.connection.db.collection('users').rename(backupCollectionName);
    console.log(`💾 Backup creado: ${backupCollectionName}`);
    
    // Rename migrated collection to original name
    await mongoose.connection.db.collection('users_migrated').rename('users');
    console.log('✅ Colección migrada ahora es la principal');
    
    console.log(`\n🎉 ¡Migración completada exitosamente!`);
    console.log(`📦 Backup disponible en: ${backupCollectionName}`);
    
  } catch (error) {
    console.error('❌ Error reemplazando colección:', error);
  }
};

// Function to rollback migration
const rollbackMigration = async () => {
  try {
    console.log('↩️  Iniciando rollback...');
    
    // Find the most recent backup
    const collections = await mongoose.connection.db.listCollections().toArray();
    const backupCollections = collections
      .filter(col => col.name.startsWith('users_backup_'))
      .sort((a, b) => b.name.localeCompare(a.name));
    
    if (backupCollections.length === 0) {
      console.log('❌ No se encontró backup para restaurar');
      return;
    }
    
    const latestBackup = backupCollections[0].name;
    
    // Drop current users collection and restore backup
    await mongoose.connection.db.collection('users').drop();
    await mongoose.connection.db.collection(latestBackup).rename('users');
    
    console.log(`✅ Rollback completado. Restaurado desde: ${latestBackup}`);
    
  } catch (error) {
    console.error('❌ Error durante rollback:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'migrate':
      await migrateUsers();
      break;
    case 'replace':
      await replaceOriginalUsers();
      break;
    case 'rollback':
      await rollbackMigration();
      break;
    default:
      console.log(`
🛠️  Script de Migración de Usuarios (Firebase → JWT)

Comandos disponibles:
  node migrateUsers.js migrate   - Migra usuarios (crea colección temporal)
  node migrateUsers.js replace   - Reemplaza colección original con migrada
  node migrateUsers.js rollback  - Restaura backup más reciente

⚠️  IMPORTANTE: 
- Ejecuta 'migrate' primero para crear usuarios migrados
- Revisa los datos en 'users_migrated' 
- Ejecuta 'replace' solo cuando estés seguro
- 'rollback' restaura el backup más reciente

📝 Contraseña temporal: TempPass123!
   Los usuarios deberán cambiarla en su primer login.
      `);
  }
  
  mongoose.connection.close();
};

main().catch(console.error);