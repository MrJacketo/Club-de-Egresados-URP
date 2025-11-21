import React, { useState, useEffect } from "react";
import { GraduationCap } from "lucide-react";
import fotoPerfil from "../../../assets/foto_perfil_xdefecto.png";
import { useProfilePhoto, getCurrentUserId } from "../../../Hooks/useProfilePhoto"; 

function SidebarIzquierda({ perfil, cambiarPerfil, datosAcademicos }) {
  const [informacionAcademica, setInformacionAcademica] = useState(null);
  
  // ✅ Usar el hook personalizado para la foto (solo lectura)
  const { photo: userPhoto } = useProfilePhoto();

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
        console.log('User ID encontrado:', userId);

        // PRIMERO intentar con clave específica de usuario
        const userAcademicKey = `academicData_${userId}`;
        let savedData = localStorage.getItem(userAcademicKey);
        
        // SI NO HAY datos específicos, intentar con la clave general
        if (!savedData) {
          savedData = localStorage.getItem('academicData');
          console.log('Intentando con clave general...', !!savedData);
        }

        if (savedData) {
          const parsedData = JSON.parse(savedData);
          console.log('Datos académicos cargados:', parsedData);
          setInformacionAcademica(parsedData);
        } else if (datosAcademicos) {
          setInformacionAcademica(datosAcademicos);
        } else {
          console.log('No se encontraron datos académicos');
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

  // Función para redirigir al formulario de perfil
  const handleEditProfile = () => {
    window.location.href = '/perfil-egresado-form';
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
          
          {/* Botón centrado */}
          <div className="text-center mt-3">
            <button 
              onClick={handleEditProfile}
              className="flex items-center gap-2 bg-white !bg-white text-black px-3 py-2 rounded-lg shadow-sm transition-colors inline-flex"
            >
              Completar Perfil
            </button>
          </div>
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
          {/* ✅ SOLO MOSTRAR LA IMAGEN - SIN POSIBILIDAD DE CAMBIARLA */}
          <div className="relative">
            <img 
              src={userPhoto} 
              alt="Perfil" 
              className="w-20 h-20 mx-auto rounded-full object-cover mb-2 border-2 border-green-500" 
            />
           
          </div>
          <h3 className="font-semibold text-gray-800">
            {informacionAcademica.nombreCompleto ? 
              informacionAcademica.nombreCompleto.split(' ').slice(0, 2).join(' ')
              : "Usuario"
            }
          </h3>
          <p className="text-gray-500 text-sm">Estudiante URP</p>
          
         <div className="text-center mt-2">
        <button 
       onClick={handleEditProfile}
      className="flex items-center gap-2 bg-white !bg-white text-black px-3 py-2 rounded-lg shadow-sm transition-colors inline-flex"
        >
      Editar perfil
      </button>
      </div>
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