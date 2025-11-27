// Script de depuración para fotos de perfil
// Ejecutar en la consola del navegador para ver el estado actual

function debugProfilePhotos() {
  console.log('🔍 DEPURACIÓN DE FOTOS DE PERFIL');
  console.log('=================================');
  
  // 1. Verificar usuario actual
  const currentUserString = localStorage.getItem('currentUser');
  let currentUser = null;
  
  if (currentUserString) {
    try {
      currentUser = JSON.parse(currentUserString);
      console.log('👤 Usuario actual:', currentUser);
      console.log('📧 Email:', currentUser.email);
      console.log('🆔 ID:', currentUser.id || currentUser._id);
      console.log('👨‍💼 Rol:', currentUser.rol);
    } catch (error) {
      console.log('❌ Error parseando usuario actual:', error);
    }
  } else {
    console.log('❌ No hay usuario en localStorage');
  }
  
  // 2. Calcular ID único
  let userId = 'default-user';
  if (currentUser) {
    if (currentUser.email) {
      userId = currentUser.email.replace('@', '_').replace('.', '_');
    } else if (currentUser.id || currentUser._id) {
      userId = currentUser.id || currentUser._id;
    }
  }
  console.log('🔑 ID único calculado:', userId);
  
  // 3. Verificar clave de foto específica
  const userPhotoKey = `userProfilePhoto_${userId}`;
  const hasUserPhoto = localStorage.getItem(userPhotoKey);
  console.log('📷 Clave de foto específica:', userPhotoKey);
  console.log('📷 ¿Tiene foto específica?', hasUserPhoto ? 'SÍ' : 'NO');
  
  if (hasUserPhoto) {
    console.log('📷 Tipo de imagen:', hasUserPhoto.substring(0, 30) + '...');
  }
  
  // 4. Listar todas las fotos de perfil
  console.log('\n📋 TODAS LAS FOTOS DE PERFIL:');
  const allKeys = Object.keys(localStorage);
  const photoKeys = allKeys.filter(key => key.includes('userProfilePhoto'));
  
  if (photoKeys.length === 0) {
    console.log('❌ No hay fotos de perfil guardadas');
  } else {
    photoKeys.forEach(key => {
      const photo = localStorage.getItem(key);
      console.log(`📷 ${key}: ${photo ? 'SÍ' : 'NO'}`);
    });
  }
  
  // 5. Verificar claves genéricas (que deberían estar limpiadas)
  console.log('\n🧹 CLAVES GENÉRICAS:');
  const genericKeys = ['userProfilePhoto', 'imagenPerfil', 'imagenPerfilForzado'];
  genericKeys.forEach(key => {
    const value = localStorage.getItem(key);
    console.log(`${key}: ${value ? '⚠️ EXISTE (debe eliminarse)' : '✅ Limpia'}`);
  });
  
  return {
    currentUser,
    userId,
    userPhotoKey,
    hasUserPhoto: !!hasUserPhoto,
    allPhotoKeys: photoKeys
  };
}

function limpiarFotosEspecificasDebug() {
  console.log('🧹 Limpiando fotos específicas...');
  const allKeys = Object.keys(localStorage);
  const photoKeys = allKeys.filter(key => key.includes('userProfilePhoto'));
  
  photoKeys.forEach(key => {
    localStorage.removeItem(key);
    console.log(`❌ Eliminada: ${key}`);
  });
  
  console.log('✅ Limpieza completada');
}

function cambiarFotoParaUsuarioActual(imagenBase64) {
  const debug = debugProfilePhotos();
  
  if (debug.userId === 'default-user') {
    console.log('❌ No se puede cambiar foto: usuario no válido');
    return;
  }
  
  localStorage.setItem(debug.userPhotoKey, imagenBase64);
  console.log(`✅ Foto cambiada para ${debug.userId}`);
  
  // Disparar evento para actualizar componentes
  window.dispatchEvent(new CustomEvent('profilePhotoUpdated', {
    detail: { photo: imagenBase64 }
  }));
}

// Exportar funciones para uso en consola
window.debugProfilePhotos = debugProfilePhotos;
window.limpiarFotosEspecificasDebug = limpiarFotosEspecificasDebug;
window.cambiarFotoParaUsuarioActual = cambiarFotoParaUsuarioActual;

console.log(`
🛠️ SCRIPTS DE DEPURACIÓN DISPONIBLES:
• debugProfilePhotos() - Ver estado completo
• limpiarFotosEspecificasDebug() - Limpiar todas las fotos
• cambiarFotoParaUsuarioActual(imagenBase64) - Cambiar foto del usuario actual

Para usar: debugProfilePhotos()
`);