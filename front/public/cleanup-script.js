// Script para limpiar localStorage y corregir fotos de perfil
// Ejecutar este script en la consola del navegador para limpiar datos residuales

// Función para limpiar localStorage de fotos genéricas
function limpiarFotosGenericas() {
  console.log('🧹 Iniciando limpieza de fotos genéricas...');
  
  // Lista de claves genéricas a eliminar
  const clavesGenericas = [
    'userProfilePhoto',
    'imagenPerfil', 
    'imagenPerfilForzado'
  ];
  
  clavesGenericas.forEach(clave => {
    if (localStorage.getItem(clave)) {
      localStorage.removeItem(clave);
      console.log(`❌ Eliminada clave genérica: ${clave}`);
    }
  });
  
  console.log('✅ Limpieza completada');
}

// Función para mostrar todas las fotos de perfil por usuario
function mostrarFotosPorUsuario() {
  console.log('📋 Fotos de perfil por usuario:');
  
  const keys = Object.keys(localStorage);
  const userPhotoKeys = keys.filter(key => key.startsWith('userProfilePhoto_'));
  
  if (userPhotoKeys.length === 0) {
    console.log('No hay fotos de perfil específicas por usuario.');
    return;
  }
  
  userPhotoKeys.forEach(key => {
    const userId = key.replace('userProfilePhoto_', '');
    const hasPhoto = localStorage.getItem(key) ? 'SÍ' : 'NO';
    console.log(`Usuario ${userId}: ${hasPhoto}`);
  });
}

// Función para ejecutar limpieza completa
function limpiezaCompleta() {
  console.log('🚀 Ejecutando limpieza completa...');
  limpiarFotosGenericas();
  mostrarFotosPorUsuario();
  console.log('✨ ¡Limpieza completa terminada!');
}

// Exportar funciones para uso en consola
window.limpiarFotosGenericas = limpiarFotosGenericas;
window.mostrarFotosPorUsuario = mostrarFotosPorUsuario;
window.limpiezaCompleta = limpiezaCompleta;

console.log(`
🛠️ Scripts de limpieza disponibles:
• limpiarFotosGenericas() - Elimina claves genéricas
• mostrarFotosPorUsuario() - Muestra fotos por usuario  
• limpiezaCompleta() - Ejecuta limpieza completa

Para usar: Ejecuta cualquiera de estas funciones en la consola.
`);