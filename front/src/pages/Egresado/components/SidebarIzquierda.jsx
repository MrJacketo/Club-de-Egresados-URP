import React, { useState, useEffect } from "react";
import { GraduationCap } from "lucide-react";
import fotoPerfil from "../../../assets/foto_perfil_xdefecto.png";
import { useProfilePhoto, getCurrentUserId } from "../../../Hooks/useProfilePhoto"; 
import { getGraduateProfileRequest } from "../../../api/perfilEgresadoApi";
import { userApi } from "../../../api/userApi";

function SidebarIzquierda({  datosAcademicos }) {
  const [informacionAcademica, setInformacionAcademica] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // ✅ Usar el hook personalizado para la foto
  const { photo: userPhoto } = useProfilePhoto();

  // Función para cargar datos desde múltiples fuentes
  const loadAcademicData = async () => {
    try {
      setIsLoading(true);
      const userId = getCurrentUserId();
      console.log('🔍 Cargando datos académicos para usuario:', userId);

      // 1. PRIMERO intentar con localStorage (datos más recientes)
      const userAcademicKey = `academicData_${userId}`;
      let savedData = localStorage.getItem(userAcademicKey);
      
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log('✅ Datos cargados desde localStorage:', parsedData);
        setInformacionAcademica(parsedData);
        setIsLoading(false);
        return;
      }

      // 2. SI NO HAY datos en localStorage, cargar desde la API
      console.log('📡 Cargando datos desde API...');
      
      try {
        // Obtener datos del usuario actual
        const currentUser = await userApi.getCurrentUser();
        if (currentUser.user && currentUser.user.name) {
          const userDataFromAPI = {
            nombreCompleto: currentUser.user.name || "",
            añoEgreso: currentUser.user.anioEgreso || "",
            carrera: currentUser.user.carrera || "",
            gradoAcademico: currentUser.user.gradoAcademico || "Egresado"
          };

          // Guardar en localStorage para futuras cargas
          localStorage.setItem(userAcademicKey, JSON.stringify(userDataFromAPI));
          setInformacionAcademica(userDataFromAPI);
          console.log('✅ Datos cargados desde API de usuario:', userDataFromAPI);
          setIsLoading(false);
          return;
        }
      } catch (userError) {
        console.log('⚠️ Error cargando datos de usuario:', userError.message);
      }

      // 3. Intentar cargar desde el perfil de egresado
      try {
        const profileResponse = await getGraduateProfileRequest();
        if (profileResponse && profileResponse.nombreCompleto) {
          const profileData = {
            nombreCompleto: profileResponse.nombreCompleto,
            añoEgreso: profileResponse.anioEgreso || "",
            carrera: profileResponse.carrera || "",
            gradoAcademico: profileResponse.gradoAcademico || "Egresado"
          };

          // Guardar en localStorage
          localStorage.setItem(userAcademicKey, JSON.stringify(profileData));
          setInformacionAcademica(profileData);
          console.log('✅ Datos cargados desde perfil de egresado:', profileData);
        }
      } catch (profileError) {
        console.log('ℹ️ No se pudo cargar perfil de egresado:', profileError.message);
      }

    } catch (error) {
      console.error('💥 Error cargando datos académicos:', error);
      
      // 4. Último recurso: usar datos de props
      if (datosAcademicos) {
        setInformacionAcademica(datosAcademicos);
        console.log('🎯 Usando datos académicos desde props:', datosAcademicos);
      } else {
        setInformacionAcademica(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos automáticamente al montar el componente
  useEffect(() => {
    loadAcademicData();

    // Escuchar cambios en el localStorage
    const handleStorageChange = (e) => {
      const userId = getCurrentUserId();
      const userAcademicKey = `academicData_${userId}`;
      
      if (e.key === userAcademicKey || e.key === 'academicData') {
        console.log('🔄 Cambio detectado en localStorage, actualizando datos...');
        loadAcademicData();
      }
    };

    // Escuchar eventos personalizados
    const handleCustomEvent = () => {
      console.log('🎊 Evento personalizado recibido, actualizando datos...');
      loadAcademicData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageUpdated', handleCustomEvent);
    window.addEventListener('academicDataUpdated', handleCustomEvent);
    window.addEventListener('profileUpdated', handleCustomEvent);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdated', handleCustomEvent);
      window.removeEventListener('academicDataUpdated', handleCustomEvent);
      window.removeEventListener('profileUpdated', handleCustomEvent);
    };
  }, [datosAcademicos]);

  // Función para redirigir al formulario de perfil
  const handleEditProfile = () => {
    window.location.href = '/perfil-egresado-form';
  };

  

  // Mostrar loading
  if (isLoading) {
    return (
      <aside style={{ display: 'block', width: '100%' }}>
        <div className="bg-white rounded-2xl p-4 mb-6">
          <h2 className="text-green-600 font-bold text-lg mb-4 flex items-center gap-2">
            <GraduationCap size={20} />
            Información Académica
          </h2>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-3"></div>
            <p className="text-gray-500">Cargando información académica...</p>
          </div>
        </div>
      </aside>
    );
  }

  // Si no hay datos académicos
  if (!informacionAcademica) {
    return (
      <aside style={{ display: 'block', width: '100%' }}>
        <div className="bg-white rounded-2xl p-4 mb-6">
          <h2 className="text-green-600 font-bold text-lg mb-4 flex items-center gap-2">
            <GraduationCap size={20} />
            Información Académica
          </h2>
          <div className="text-center py-4">
            <p className="text-gray-500 mb-3">Complete su perfil académico</p>
            <p className="text-gray-400 text-sm mb-4">Los datos se cargarán automáticamente</p>
            
            <button 
              onClick={handleEditProfile}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-600 transition-colors mx-auto"
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-green-600 font-bold text-lg flex items-center gap-2">
            <GraduationCap size={20} />
            Información Académica
          </h2>
          
        </div>
        
        <div className="text-center mb-4">
          <div className="relative">
            <img 
              src={userPhoto || fotoPerfil} 
              alt="Perfil" 
              className="w-20 h-20 mx-auto rounded-full object-cover mb-2 border-2 border-green-500" 
              onError={(e) => {
                console.log('🖼️ Error cargando foto, usando imagen por defecto');
                e.target.src = fotoPerfil;
              }}
            />
          </div>
          <h3 className="font-semibold text-gray-800 text-lg">
            {informacionAcademica.nombreCompleto ? 
              informacionAcademica.nombreCompleto.split(' ').slice(0, 2).join(' ')
              : "Usuario"
            }
          </h3>
          <p className="text-gray-500 text-sm">Egresado URP</p>
          
          <div className="flex justify-center">
          <button 
        onClick={handleEditProfile}
          className="flex items-center gap-2 bg-white !bg-white text-black px-3 py-2 rounded-lg shadow-sm transition-colors"
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