import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createOrUpdateGraduateProfileRequest,
  getGraduateProfileRequest,
  OptionsRequest,
} from "../api/perfilEgresadoApi";
import { userApi } from "../api/userApi";
import { toast } from "react-hot-toast";
import { useUser } from "../context/userContext";
import fotoPerfil from "../assets/foto_perfil_xdefecto.png"; // Asegúrate de importar la imagen por defecto

export default function PerfilEgresadoForm() {
  const navigate = useNavigate();
  const { userName } = useUser();
  const [photo, setPhoto] = useState(fotoPerfil); // Usar la imagen importada por defecto
  const [selectedFile, setSelectedFile] = useState(null);

  const [userData, setUserData] = useState({
    nombreCompleto: userName || "",
    anioEgreso: "",
    carrera: "",
    gradoAcademico: "",
  });

  const [profileData, setProfileData] = useState({
    interesesProfesionales: {
      areasInteres: [],
      modalidad: "",
      tipoJornada: "",
    },
    habilidades: {
      idiomas: [],
    },
    ubicacion: {
      distritoResidencia: "",
      disponibilidadReubicacion: false,
      disponibilidadViajar: false,
    },
  });

  const [options, setOptions] = useState({
    carreras: [],
    gradosAcademicos: [],
    areasInteres: [],
    modalidades: [],
    tiposJornada: [],
    idiomas: [],
    distritosResidencia: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

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

  // Función para convertir file a base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validaciones
    if (!file.type.startsWith('image/')) {
      toast.error("Por favor, selecciona un archivo de imagen válido");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen debe ser menor a 5MB");
      return;
    }

    try {
      // Convertir la imagen a Base64 para guardar en localStorage
      const base64Image = await fileToBase64(file);
      const userId = getCurrentUserId();
      
      // ✅ GUARDAR FOTO CON CLAVE ESPECÍFICA DEL USUARIO
      const userPhotoKey = `userProfilePhoto_${userId}`;
      localStorage.setItem(userPhotoKey, base64Image);
      
      // Actualizar el estado para mostrar la imagen inmediatamente
      setPhoto(base64Image);
      setSelectedFile(file);
      
      toast.success("Foto de perfil guardada correctamente");
    } catch (error) {
      console.error("Error procesando la imagen:", error);
      toast.error("Error al procesar la imagen");
    }
  };

  const handleRemovePhoto = () => {
    const userId = getCurrentUserId();
    const userPhotoKey = `userProfilePhoto_${userId}`;
    
    localStorage.removeItem(userPhotoKey);
    // También eliminar la clave general por compatibilidad
    localStorage.removeItem('userProfilePhoto');
    
    setPhoto(fotoPerfil);
    setSelectedFile(null);
    toast.success("Foto de perfil eliminada");
  };

  // Función para cargar la foto del usuario
  const loadUserPhoto = () => {
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
        setPhoto(savedPhoto);
      } else {
        setPhoto(fotoPerfil);
      }
    } catch (error) {
      console.error('Error cargando foto:', error);
      setPhoto(fotoPerfil);
    }
  };

  // En el useEffect donde cargas los datos
  useEffect(() => {
    const fetchDataAndOptions = async () => {
      try {
        const optionsData = await OptionsRequest();
        setOptions(optionsData);

        const currentUser = await userApi.getCurrentUser();
        if (currentUser.user) {
          const userDataActualizado = {
            nombreCompleto: currentUser.user.name || userName || "",
            anioEgreso: currentUser.user.anioEgreso || "",
            carrera: currentUser.user.carrera || "",
            gradoAcademico: currentUser.user.gradoAcademico || "",
          };
          
          setUserData(userDataActualizado);
          
          // GUARDAR INMEDIATAMENTE EN LOCALSTORAGE PARA EL SIDEBAR
          const userId = getCurrentUserId();
          const datosParaSidebar = {
            nombreCompleto: userDataActualizado.nombreCompleto,
            añoEgreso: userDataActualizado.anioEgreso,
            carrera: userDataActualizado.carrera,
            gradoAcademico: userDataActualizado.gradoAcademico
          };
          
          // Guardar con clave específica del usuario
          const userAcademicKey = `academicData_${userId}`;
          localStorage.setItem(userAcademicKey, JSON.stringify(datosParaSidebar));
        }

        const profileResponse = await getGraduateProfileRequest();
        if (profileResponse) {
          setProfileData({
            interesesProfesionales: {
              areasInteres: profileResponse.interesesProfesionales?.areasInteres || [],
              modalidad: profileResponse.interesesProfesionales?.modalidad || "",
              tipoJornada: profileResponse.interesesProfesionales?.tipoJornada || "",
            },
            habilidades: {
              idiomas: profileResponse.habilidades?.idiomas || [],
            },
            ubicacion: {
              distritoResidencia: profileResponse.ubicacion?.distritoResidencia || "",
              disponibilidadReubicacion:
                profileResponse.ubicacion?.disponibilidadReubicacion || false,
              disponibilidadViajar:
                profileResponse.ubicacion?.disponibilidadViajar || false,
            },
          });

          // Actualizar también con datos del perfil si existen
          if (profileResponse.nombreCompleto) {
            const userId = getCurrentUserId();
            const datosParaSidebar = {
              nombreCompleto: profileResponse.nombreCompleto,
              añoEgreso: userData.anioEgreso || "",
              carrera: userData.carrera || "",
              gradoAcademico: userData.gradoAcademico || ""
            };
            
            const userAcademicKey = `academicData_${userId}`;
            localStorage.setItem(userAcademicKey, JSON.stringify(datosParaSidebar));
          }

          // Cargar foto del perfil si existe
          if (profileResponse.profilePicture) {
            const userId = getCurrentUserId();
            const userPhotoKey = `userProfilePhoto_${userId}`;
            localStorage.setItem(userPhotoKey, profileResponse.profilePicture);
            setPhoto(profileResponse.profilePicture);
          } else {
            loadUserPhoto();
          }
        } else {
          loadUserPhoto();
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
        loadUserPhoto(); // Asegurar que se cargue la foto por defecto en caso de error
      } finally {
        setIsInitializing(false);
      }
    };
    fetchDataAndOptions();
  }, [userName]);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => { 
      const newUserData = { ...prev, [name]: value };
      
      // ACTUALIZAR LOCALSTORAGE CADA VEZ QUE CAMBIE UN DATO
      const userId = getCurrentUserId();
      const datosParaSidebar = {
        nombreCompleto: newUserData.nombreCompleto,
        añoEgreso: newUserData.anioEgreso,
        carrera: newUserData.carrera,
        gradoAcademico: newUserData.gradoAcademico
      };
      
      // Guardar con clave específica del usuario
      const userAcademicKey = `academicData_${userId}`;
      localStorage.setItem(userAcademicKey, JSON.stringify(datosParaSidebar));
      
      return newUserData;
    });
  };

  const handleNestedChange = (e, parentKey) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [parentKey]: { ...prev[parentKey], [name]: value },
    }));
  };

  const addIdioma = () => {
    setProfileData((prev) => ({
      ...prev,
      habilidades: {
        ...prev.habilidades,
        idiomas: [...(prev.habilidades?.idiomas || []), { idioma: "", nivel: "" }],
      },
    }));
  };

  const handleIdiomasChange = (index, field, value) => {
    setProfileData((prev) => {
      const updated = [...(prev.habilidades?.idiomas || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, habilidades: { ...prev.habilidades, idiomas: updated } };
    });
  };

  const removeIdioma = (index) => {
    setProfileData((prev) => {
      const updated = (prev.habilidades?.idiomas || []).filter((_, i) => i !== index);
      return { ...prev, habilidades: { ...prev.habilidades, idiomas: updated } };
    });
  };

  // En el handleSubmit del PerfilEgresadoForm
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!userData.nombreCompleto.trim()) return toast.error("El nombre completo es requerido");
      if (!userData.anioEgreso) return toast.error("El año de egreso es requerido");
      if (!userData.carrera) return toast.error("La carrera es requerida");

      // 1. GUARDAR DATOS ACADÉMICOS EN LOCALSTORAGE PARA EL SIDEBAR
      const userId = getCurrentUserId();
      const datosAcademicosParaSidebar = {
        nombreCompleto: userData.nombreCompleto.trim(),
        añoEgreso: userData.anioEgreso,
        carrera: userData.carrera,
        gradoAcademico: userData.gradoAcademico || "Egresado"
      };
      
      // Guardar con clave específica del usuario
      const userAcademicKey = `academicData_${userId}`;
      localStorage.setItem(userAcademicKey, JSON.stringify(datosAcademicosParaSidebar));

      // 2. Actualiza datos académicos en la API
      await userApi.updateAcademicData({
        anioEgreso: userData.anioEgreso,
        carrera: userData.carrera,
        gradoAcademico: userData.gradoAcademico || "Egresado",
      });

      // 3. Guardar la foto en el perfil si existe (solo si no es la imagen por defecto)
      const userPhotoKey = `userProfilePhoto_${userId}`;
      const savedPhoto = localStorage.getItem(userPhotoKey);
      
      const profileWithPhoto = {
        nombreCompleto: userData.nombreCompleto.trim(),
        interesesProfesionales: {
          ...profileData.interesesProfesionales,
          modalidad: profileData.interesesProfesionales?.modalidad || "Presencial",
          tipoJornada: profileData.interesesProfesionales?.tipoJornada || "Tiempo completo",
        },
        habilidades: {
          ...profileData.habilidades,
          idiomas: (profileData.habilidades?.idiomas || []).filter((i) => i.idioma && i.nivel),
        },
        ubicacion: {
          ...profileData.ubicacion,
          distritoResidencia: profileData.ubicacion?.distritoResidencia || "Cercado de Lima",
        },
      };

      // Solo agregar profilePicture si existe y no es la imagen por defecto
      if (savedPhoto && savedPhoto !== fotoPerfil && !savedPhoto.includes("foto_perfil_xdefecto.png")) {
        profileWithPhoto.profilePicture = savedPhoto;
      }

      // 4. Guarda el perfil completo
      await createOrUpdateGraduateProfileRequest(profileWithPhoto);

      toast.success("Perfil guardado exitosamente!");
      navigate("/welcome-egresado");
      
    } catch (error) {
      console.error("Error al guardar el perfil:", error);
      toast.error(error.response?.data?.error || "Error al guardar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="w-full min-h-screen bg-[#1C1D21] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BC4F] mx-auto"></div>
          <p className="mt-4 text-lg">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#1C1D21] text-white flex flex-col">
      <main className="flex flex-col md:flex-row flex-1 p-10 gap-10">
        {/* FOTO */}
        <div className="flex flex-col items-center md:w-1/3">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#00BC4F] shadow-lg">
            <img 
              src={photo} 
              alt="Foto de perfil" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Si hay error al cargar la imagen, mostrar la por defecto
                e.target.src = fotoPerfil;
              }}
            />
          </div>
          <label
            htmlFor="photo"
            className="mt-4 px-4 py-2 bg-[#00BC4F] rounded-lg text-white font-semibold cursor-pointer hover:bg-green-600 transition"
          >
            Editar foto de perfil
          </label>
          <input type="file" id="photo" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          
          {/* Botón para eliminar foto - solo mostrar si no es la imagen por defecto */}
          {photo !== fotoPerfil && !photo.includes("foto_perfil_xdefecto.png") && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="mt-2 px-4 py-2 bg-red-600 rounded-lg text-white font-semibold hover:bg-red-700 transition"
            >
              Eliminar foto
            </button>
          )}
        </div>

        {/* FORMULARIO */}
        <div className="md:w-2/3 rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-[#00BC4F]">Perfil del Egresado</h2>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-6 text-left text-lg">
            {/* DATOS ACADÉMICOS */}
            <div>
              <label className="text-[#00BC4F] font-semibold block">Nombre completo:</label>
              <input
                type="text"
                name="nombreCompleto"
                value={userData.nombreCompleto}
                onChange={handleUserChange}
                className="w-full mt-1 px-3 py-2 bg-[#2A2B30] text-white border border-[#00BC4F] rounded-lg focus:ring-2 focus:ring-[#00BC4F]"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-[#00BC4F] font-semibold block">Año de egreso:</label>
                <input
                  type="number"
                  name="anioEgreso"
                  value={userData.anioEgreso}
                  onChange={handleUserChange}
                  className="w-full mt-1 px-3 py-2 bg-[#2A2B30] border border-[#00BC4F] rounded-lg focus:ring-2 focus:ring-[#00BC4F]"
                />
              </div>
              <div>
                <label className="text-[#00BC4F] font-semibold block">Carrera:</label>
                <select
                  name="carrera"
                  value={userData.carrera || ""}
                  onChange={handleUserChange}
                  className="w-full mt-1 px-3 py-2 bg-[#2A2B30] border border-[#00BC4F] rounded-lg focus:ring-2 focus:ring-[#00BC4F] text-white"
                  required
                >
                  <option value="">Seleccione su carrera</option>
                  <option value="Administración y Gerencia">Administración y Gerencia</option>
                  <option value="Administración de Negocios Globales">Administración de Negocios Globales</option>
                  <option value="Arquitectura">Arquitectura</option>
                  <option value="Biología">Biología</option>
                  <option value="Contabilidad y Finanzas">Contabilidad y Finanzas</option>
                  <option value="Derecho y Ciencia Política">Derecho y Ciencia Política</option>
                  <option value="Economía">Economía</option>
                  <option value="Ingeniería Civil">Ingeniería Civil</option>
                  <option value="Ingeniería Electrónica">Ingeniería Electrónica</option>
                  <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                  <option value="Ingeniería Informática">Ingeniería Informática</option>
                  <option value="Ingeniería Mecatrónica">Ingeniería Mecatrónica</option>
                  <option value="Marketing Global y Administración Comercial">Marketing Global y Administración Comercial</option>
                  <option value="Medicina Humana">Medicina Humana</option>
                  <option value="Medicina Veterinaria">Medicina Veterinaria</option>
                  <option value="Psicología">Psicología</option>
                  <option value="Traducción e Interpretación">Traducción e Interpretación</option>
                  <option value="Turismo, Hotelería y Gastronomía">Turismo, Hotelería y Gastronomía</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[#00BC4F] font-semibold block">Grado Académico:</label>
              <input
                type="text"
                name="gradoAcademico"
                value={userData.gradoAcademico}
                onChange={handleUserChange}
                className="w-full mt-1 px-3 py-2 bg-[#2A2B30] border border-[#00BC4F] rounded-lg focus:ring-2 focus:ring-[#00BC4F]"
              />
            </div>

            {/* INTERESES PROFESIONALES */}
            <div>
              <label className="text-[#00BC4F] font-semibold block mb-2">Áreas de Interés:</label>
              {(profileData.interesesProfesionales?.areasInteres || []).map((area, index) => (
                <div key={index} className="flex space-x-4 items-center mb-2">
                  <select
                    value={area}
                    onChange={(e) => {
                      const value = e.target.value;
                      setProfileData((prev) => {
                        const updatedAreasInteres = [...(prev.interesesProfesionales?.areasInteres || [])];
                        updatedAreasInteres[index] = value;
                        return {
                          ...prev,
                          interesesProfesionales: {
                            ...prev.interesesProfesionales,
                            areasInteres: updatedAreasInteres,
                          },
                        };
                      });
                    }}
                    className="w-full mt-1 p-2 border border-[#00BC4F] bg-[#2A2B30] rounded text-white"
                  >
                    <option value="">Selecciona un área</option>
                    {options.areasInteres.map((areaOpt) => (
                      <option key={areaOpt} value={areaOpt}>
                        {areaOpt}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() =>
                      setProfileData((prev) => ({
                        ...prev,
                        interesesProfesionales: {
                          ...prev.interesesProfesionales,
                          areasInteres: prev.interesesProfesionales.areasInteres.filter((_, i) => i !== index),
                        },
                      }))
                    }
                    className="px-3 py-1 bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    X
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  setProfileData((prev) => ({
                    ...prev,
                    interesesProfesionales: {
                      ...prev.interesesProfesionales,
                      areasInteres: [...(prev.interesesProfesionales?.areasInteres || []), ""],
                    },
                  }))
                }
                className="mt-2 px-4 py-2 bg-[#00BC4F] rounded-lg font-semibold hover:bg-green-600 transition"
              >
                + Añadir área
              </button>

              {/* NUEVAS OPCIONES - Modalidad y Jornada */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-[#00BC4F]">Modalidad Preferida de Empleo</label>
                <select
                  name="modalidad"
                  value={profileData.interesesProfesionales?.modalidad || ""}
                  onChange={(e) => handleNestedChange(e, "interesesProfesionales")}
                  className="w-full mt-1 p-2 border border-[#00BC4F] bg-[#2A2B30] rounded text-white"
                >
                  <option value="">Seleccione una modalidad</option>
                  {options.modalidades.map((modalidad) => (
                    <option key={modalidad} value={modalidad}>
                      {modalidad}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-[#00BC4F]">Tipo de Jornada</label>
                <select
                  name="tipoJornada"
                  value={profileData.interesesProfesionales?.tipoJornada || ""}
                  onChange={(e) => handleNestedChange(e, "interesesProfesionales")}
                  className="w-full mt-1 p-2 border border-[#00BC4F] bg-[#2A2B30] rounded text-white"
                >
                  <option value="">Seleccione un tipo de jornada</option>
                  {options.tiposJornada.map((jornada) => (
                    <option key={jornada} value={jornada}>
                      {jornada}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* IDIOMAS */}
            <div>
              <label className="text-[#00BC4F] font-semibold block mb-2">Idiomas:</label>
              {(profileData.habilidades?.idiomas || []).map((idioma, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Idioma"
                    value={idioma.idioma}
                    onChange={(e) => handleIdiomasChange(index, "idioma", e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#2A2B30] border border-[#00BC4F] rounded-lg focus:ring-2 focus:ring-[#00BC4F]"
                  />
                  <select
                  value={idioma.nivel}
                    onChange={(e) => handleIdiomasChange(index, "nivel", e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#2A2B30] border border-[#00BC4F] rounded-lg focus:ring-2 focus:ring-[#00BC4F]"
                    required
                  >
                    <option value="">Seleccione nivel</option>
                    <option value="Básico">Básico</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                    <option value="Nativo">Nativo</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeIdioma(index)}
                    className="px-3 py-1 bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addIdioma}
                className="mt-2 px-4 py-2 bg-[#00BC4F] rounded-lg font-semibold hover:bg-green-600 transition"
              >
                + Añadir idioma
              </button>

              {/* NUEVAS OPCIONES - Ubicación */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-[#00BC4F]">
                  Distrito de Residencia
                </label>
                <select
                  name="distritoResidencia"
                  value={profileData.ubicacion?.distritoResidencia || ""}
                  onChange={(e) => handleNestedChange(e, "ubicacion")}
                  className="w-full mt-1 p-2 border border-[#00BC4F] bg-[#2A2B30] rounded text-white"
                >
                  <option value="">Seleccione un distrito</option>
                  {options.distritosResidencia.map((distrito) => (
                    <option key={distrito} value={distrito}>
                      {distrito}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-[#00BC4F]">
                  Disponibilidad para Reubicación
                </label>
                <input
                  type="checkbox"
                  name="disponibilidadReubicacion"
                  checked={profileData.ubicacion?.disponibilidadReubicacion || false}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      ubicacion: {
                        ...prev.ubicacion,
                        disponibilidadReubicacion: e.target.checked,
                      },
                    }))
                  }
                  className="mt-1"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-[#00BC4F]">
                  Disponibilidad para Viajar
                </label>
                <input
                  type="checkbox"
                  name="disponibilidadViajar"
                  checked={profileData.ubicacion?.disponibilidadViajar || false}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      ubicacion: {
                        ...prev.ubicacion,
                        disponibilidadViajar: e.target.checked,
                      },
                    }))
                  }
                  className="mt-1"
                />
              </div>
            </div>

           {/* BOTONES */}
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 rounded-lg text-white font-semibold transition ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#00BC4F] hover:bg-[#009B42]"
                  }`}
                >
                  {isLoading ? "Guardando..." : "Guardar Perfil"}
                </button>
              </div>
          </form>
          </div>
          </main>
          </div>
  );
}