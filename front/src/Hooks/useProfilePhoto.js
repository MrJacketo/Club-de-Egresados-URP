import { useState, useEffect } from "react";
import fotoPerfil from "../assets/foto_perfil_xdefecto.png";

// Función para obtener ID del usuario actual
export const getCurrentUserId = () => {
  try {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      return userData.id || userData._id || 'default-user';
    }
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

  // Cargar foto del usuario
  const loadUserPhoto = () => {
    try {
      const userPhotoKey = getUserPhotoKey();
      let savedPhoto = localStorage.getItem(userPhotoKey);
      
      // Si no hay foto específica, intentar con la clave general
      if (!savedPhoto) {
        savedPhoto = localStorage.getItem('userProfilePhoto');
      }

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
      // También eliminar la clave general por compatibilidad
      localStorage.removeItem('userProfilePhoto');
      
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
      }
    };

    // Escuchar cambios en localStorage de otras pestañas
    const handleStorageChange = (e) => {
      if (e.key === getUserPhotoKey() || e.key === 'userProfilePhoto') {
        loadUserPhoto();
      }
    };

    window.addEventListener('profilePhotoUpdated', handlePhotoUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('profilePhotoUpdated', handlePhotoUpdate);
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