// Función para migrar fotos de perfil de claves genéricas a específicas por usuario
import { getCurrentUserId } from '../Hooks/useProfilePhoto.js';

export const migrateProfilePhotos = () => {
  try {
    const userId = getCurrentUserId();
    const userPhotoKey = `userProfilePhoto_${userId}`;
    
    // Verificar si el usuario ya tiene una foto específica
    const existingUserPhoto = localStorage.getItem(userPhotoKey);
    
    // Si no tiene foto específica, buscar en las claves genéricas
    if (!existingUserPhoto) {
      const genericPhoto = localStorage.getItem('userProfilePhoto');
      const legacyPhoto = localStorage.getItem('imagenPerfil');
      const forcedPhoto = localStorage.getItem('imagenPerfilForzado');
      
      // Usar la primera foto válida que encuentre
      const photoToMigrate = genericPhoto || legacyPhoto || forcedPhoto;
      
      if (photoToMigrate && photoToMigrate.startsWith('data:image')) {
        // Migrar la foto a la clave específica del usuario
        localStorage.setItem(userPhotoKey, photoToMigrate);
        console.log('✅ Foto migrada exitosamente para usuario:', userId);
      }
    }
    
    // Limpiar claves genéricas para evitar conflictos
    localStorage.removeItem('userProfilePhoto');
    localStorage.removeItem('imagenPerfil');
    localStorage.removeItem('imagenPerfilForzado');
    
    console.log('🧹 Claves genéricas limpiadas para mantener fotos específicas por usuario');
    
  } catch (error) {
    console.error('❌ Error durante la migración de fotos:', error);
  }
};

// Función para ejecutar la migración solo una vez por sesión
export const runPhotoMigrationOnce = () => {
  const migrationKey = 'photoMigrationCompleted';
  const sessionMigrationKey = `${migrationKey}_${Date.now()}`;
  
  // Verificar si ya se ejecutó la migración en esta sesión
  if (!sessionStorage.getItem(migrationKey)) {
    migrateProfilePhotos();
    sessionStorage.setItem(migrationKey, 'true');
  }
};