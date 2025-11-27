import { useState, useEffect } from "react";
import fotoPerfil from "../assets/foto_perfil_xdefecto.png";

// Función para obtener ID del usuario actual (usando email como identificador único)
export const getCurrentUserId = () => {
  try {
    // Primero intentar desde localStorage con estructura completa
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      // Usar email como identificador único ya que es único por usuario
      if (userData.email) {
        return userData.email.replace('@', '_').replace('.', '_');
      }
      // Fallback al ID si no hay email
      if (userData.id || userData._id) {
        return userData.id || userData._id;
      }
    }
    
    // Intentar desde el contexto de usuario si existe
    if (window.userContext && window.userContext.user) {
      const user = window.userContext.user;
      if (user.email) {
        return user.email.replace('@', '_').replace('.', '_');
      }
      if (user.id || user._id) {
        return user.id || user._id;
      }
    }
    
    console.warn('No se pudo obtener identificador único del usuario');
    return 'default-user';
  } catch (error) {
    console.error('Error obteniendo ID del usuario:', error);
    return 'default-user';
  }
};

// Hook personalizado para manejar la foto de perfil
export const useProfilePhoto = () => {
  const [photo, setPhoto] = useState(fotoPerfil);

  // Obtener la clave específica del usuario para localStorage
  const getUserPhotoKey = () => `userProfilePhoto_${getCurrentUserId()}`;

  // Cargar foto del usuario (específica, sin fallback genérico)
  const loadUserPhoto = () => {
    try {
      const userPhotoKey = getUserPhotoKey();
      let savedPhoto = localStorage.getItem(userPhotoKey);

      if (savedPhoto) {
        setPhoto(savedPhoto);
        return savedPhoto;
      } else {
        setPhoto(fotoPerfil);
        return fotoPerfil;
      }
    } catch (error) {
      console.error('Error cargando foto:', error);
      setPhoto(fotoPerfil);
      return fotoPerfil;
    }
  };

  // Guardar foto del usuario
  const saveUserPhoto = (base64Image) => {
    try {
      const userPhotoKey = getUserPhotoKey();
      localStorage.setItem(userPhotoKey, base64Image);
      setPhoto(base64Image);
      
      // Disparar evento personalizado para notificar a otros componentes
      window.dispatchEvent(new CustomEvent('profilePhotoUpdated', {
        detail: { photo: base64Image }
      }));
      
      return true;
    } catch (error) {
      console.error('Error guardando foto:', error);
      return false;
    }
  };

  // Eliminar foto del usuario
  const removeUserPhoto = () => {
    try {
      const userPhotoKey = getUserPhotoKey();
      localStorage.removeItem(userPhotoKey);
      // Eliminado: No usar clave genérica para mantener fotos específicas por usuario
      
      setPhoto(fotoPerfil);
      
      // Disparar evento personalizado
      window.dispatchEvent(new CustomEvent('profilePhotoUpdated', {
        detail: { photo: fotoPerfil }
      }));
      
      return true;
    } catch (error) {
      console.error('Error eliminando foto:', error);
      return false;
    }
  };

  // Escuchar cambios en la foto
  useEffect(() => {
    // Cargar foto al inicializar
    loadUserPhoto();

    // Escuchar evento personalizado
    const handlePhotoUpdate = (event) => {
      if (event.detail && event.detail.photo) {
        setPhoto(event.detail.photo);
      } else {
        // Si no hay foto en el evento, recargar desde localStorage
        loadUserPhoto();
      }
    };

    // Escuchar cambios de usuario para recargar foto
    const handleUserChange = () => {
      console.log('🔄 Usuario cambió, recargando foto...');
      loadUserPhoto();
    };

    // Escuchar cambios en localStorage de otras pestañas
    const handleStorageChange = (e) => {
      if (e.key === getUserPhotoKey() || e.key === 'currentUser') {
        console.log('🔄 Cambio relevante en localStorage, recargando foto...');
        loadUserPhoto();
      }
    };

    window.addEventListener('profilePhotoUpdated', handlePhotoUpdate);
    window.addEventListener('userLoggedIn', handleUserChange);
    window.addEventListener('userLoggedOut', handleUserChange);
    window.addEventListener('userDataUpdated', handleUserChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('profilePhotoUpdated', handlePhotoUpdate);
      window.removeEventListener('userLoggedIn', handleUserChange);
      window.removeEventListener('userLoggedOut', handleUserChange);
      window.removeEventListener('userDataUpdated', handleUserChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    photo,
    loadUserPhoto,
    saveUserPhoto,
    removeUserPhoto,
    getUserPhotoKey
  };
};