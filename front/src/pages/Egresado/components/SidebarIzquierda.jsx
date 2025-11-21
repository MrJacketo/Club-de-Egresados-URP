import React, { useState, useEffect } from "react";
import { GraduationCap } from "lucide-react";
import fotoPerfil from "../../../assets/foto_perfil_xdefecto.png";

function SidebarIzquierda({ perfil, cambiarPerfil, datosAcademicos }) {
  const [userPhoto, setUserPhoto] = useState(perfil || fotoPerfil);
  const [informacionAcademica, setInformacionAcademica] = useState(null);

  // Obtener ID del usuario actual de forma segura
  const getCurrentUserId = () => {
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

  // Cargar datos académicos del localStorage ESPECÍFICOS DEL USUARIO
  useEffect(() => {
    const loadAcademicData = () => {
      try {
        const userId = getCurrentUserId();
        console.log('User ID encontrado:', userId); // Para debug

        // PRIMERO intentar con clave específica de usuario
        const userAcademicKey = `academicData_${userId}`;
        let savedData = localStorage.getItem(userAcademicKey);
        
        // SI NO HAY datos específicos, intentar con la clave general (backward compatibility)
        if (!savedData) {
          savedData = localStorage.getItem('academicData');
          console.log('Intentando con clave general...', !!savedData); // Para debug
        }

        if (savedData) {
          const parsedData = JSON.parse(savedData);
          console.log('Datos académicos cargados:', parsedData); // Para debug
          setInformacionAcademica(parsedData);
        } else if (datosAcademicos) {
          // Si se pasan datos por props
          setInformacionAcademica(datosAcademicos);
        } else {
          console.log('No se encontraron datos académicos'); // Para debug
          setInformacionAcademica(null);
        }
      } catch (error) {
        console.error('Error cargando datos académicos:', error);
        setInformacionAcademica(null);
      }
    };

    loadAcademicData();

    // Escuchar cambios en el localStorage
    const handleStorageChange = () => {
      loadAcademicData();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // También verificar cada segundo por cambios
    const interval = setInterval(loadAcademicData, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [datosAcademicos]);

  // Cargar foto del localStorage ESPECÍFICA DEL USUARIO
  useEffect(() => {
    const loadPhoto = () => {
      try {
        const userId = getCurrentUserId();
        
        // PRIMERO intentar con clave específica de usuario
        const userPhotoKey = `userProfilePhoto_${userId}`;
        let savedPhoto = localStorage.getItem(userPhotoKey);
        
        // SI NO HAY foto específica, intentar con la clave general
        if (!savedPhoto) {
          savedPhoto = localStorage.getItem('userProfilePhoto');
        }

        if (savedPhoto) {
          setUserPhoto(savedPhoto);
          if (cambiarPerfil) {
            cambiarPerfil(savedPhoto);
          }
        } else {
          setUserPhoto(fotoPerfil);
          if (cambiarPerfil) {
            cambiarPerfil(fotoPerfil);
          }
        }
      } catch (error) {
        console.error('Error cargando foto:', error);
        setUserPhoto(fotoPerfil);
      }
    };

    loadPhoto();

    const handleStorageChange = () => {
      loadPhoto();
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(loadPhoto, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [perfil, cambiarPerfil]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.type.startsWith('image/')) {
        alert("Por favor, selecciona un archivo de imagen válido");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen debe ser menor a 5MB");
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (event) => {
        const nuevaImagen = event.target.result;
        const userId = getCurrentUserId();
        
        // ✅ GUARDAR FOTO CON CLAVE ESPECÍFICA DEL USUARIO
        const userPhotoKey = `userProfilePhoto_${userId}`;
        localStorage.setItem(userPhotoKey, nuevaImagen);
        
        setUserPhoto(nuevaImagen);
        if (cambiarPerfil) {
          cambiarPerfil(nuevaImagen);
        }
        
        window.dispatchEvent(new Event('storage'));
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Si no hay datos académicos, mostrar mensaje
  if (!informacionAcademica) {
    return (
      <aside style={{ display: 'block', width: '100%' }}>
        <div className="bg-white rounded-2xl p-4 mb-6">
          <h2 className="text-green-600 font-bold text-lg mb-4 flex items-center gap-2">
            <GraduationCap size={20} />
            Información Académica
          </h2>
          <div className="text-center py-4">
            
            <p className="text-gray-500">Complete su perfil académico en la sección de Mi Perfil</p>
            
            <button 
              onClick={() => window.location.href = '/perfil-egresado-form'}
              className="flex items-center gap-2 bg-white !bg-white text-black px-3 py-2 rounded-lg shadow-sm transition-colors"
            >
              Completar Perfil
            </button>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside style={{ display: 'block', width: '100%' }}>
      <div className="bg-white rounded-2xl p-4 mb-6">
        <h2 className="text-green-600 font-bold text-lg mb-4 flex items-center gap-2">
          <GraduationCap size={20} />
          Información Académica
        </h2>
        
        <div className="text-center mb-4">
          <label className="relative cursor-pointer">
            <img 
              src={userPhoto} 
              alt="Perfil" 
              className="w-20 h-20 mx-auto rounded-full object-cover mb-2 border-2 border-green-500" 
            />
            <div className="absolute bottom-2 right-1/2 transform translate-x-12 bg-green-500 rounded-full p-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="cursor-pointer">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange} 
            />
          </label>
          <h3 className="font-semibold text-gray-800">
            {informacionAcademica.nombreCompleto ? 
              informacionAcademica.nombreCompleto.split(' ').slice(0, 2).join(' ')
              : "Usuario"
            }
          </h3>
          <p className="text-gray-500 text-sm">Estudiante URP</p>
        </div>

        <div className="space-y-3 border-t border-gray-100 pt-4">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Nombre Completo</label>
              <p className="text-sm font-semibold text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                {informacionAcademica.nombreCompleto || "No especificado"}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Año de Egreso</label>
                <p className="text-sm font-semibold text-green-700 bg-green-50 px-3 py-2 rounded-lg text-center">
                  {informacionAcademica.añoEgreso || informacionAcademica.anioEgreso || "No especificado"}
                </p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Grado Académico</label>
                <p className="text-sm font-semibold text-green-700 bg-green-50 px-3 py-2 rounded-lg text-center">
                  {informacionAcademica.gradoAcademico || "No especificado"}
                </p>
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Carrera</label>
              <p className="text-sm font-semibold text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                {informacionAcademica.carrera || "No especificado"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default SidebarIzquierda;