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

export default function PerfilEgresadoForm() {
  const navigate = useNavigate();
  const { userName } = useUser(); // Get userName from context
  
  // Separate state for user data (academic info)
  const [userData, setUserData] = useState({
    nombreCompleto: userName || "",
    anioEgreso: "",
    carrera: "",
    gradoAcademico: "",
  });

  // Separate state for profile data (professional preferences)
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

  // Update nombreCompleto when userName changes
  useEffect(() => {
    if (userName && !userData.nombreCompleto) {
      setUserData((prev) => ({
        ...prev,
        nombreCompleto: userName,
      }));
    }
  }, [userName, userData.nombreCompleto]);

  useEffect(() => {
    const fetchDataAndOptions = async () => {
      try {
        // Fetch options for dropdowns
        const optionsData = await OptionsRequest();
        setOptions(optionsData);
  
        // Fetch current user data (academic info)
        try {
          const currentUser = await userApi.getCurrentUser();
          if (currentUser.user) {
            setUserData({
              nombreCompleto: currentUser.user.name || userName || "",
              anioEgreso: currentUser.user.anioEgreso || "",
              carrera: currentUser.user.carrera || "",
              gradoAcademico: currentUser.user.gradoAcademico || "",
            });
          }
        } catch (userError) {
          console.warn("Could not fetch user data:", userError);
          if (userName) {
            setUserData(prev => ({ ...prev, nombreCompleto: userName }));
          }
        }

        // Fetch existing profile (professional preferences)
        try {
          const profileResponse = await getGraduateProfileRequest();
          if (profileResponse) {
            setProfileData(profileResponse);
          }
        } catch (profileError) {
          if (profileError.response?.status === 404) {
            console.warn("No profile found. User can create a new profile.");
          } else {
            console.error("Error fetching profile:", profileError);
          }
        }
      } catch (error) {
        console.error("Error fetching data or options:", error);
      } finally {
        setIsInitializing(false);
      }
    };
  
    fetchDataAndOptions();
  }, [userName]);

  // Handler for user data changes (academic info)
  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler for profile data changes (professional preferences)
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (e, parentKey) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [name]: value,
      },
    }));
  };
  const addAreaInteres = () => {
    setProfileData((prev) => ({
      ...prev,
      interesesProfesionales: {
        ...prev.interesesProfesionales,
        areasInteres: [...(prev.interesesProfesionales?.areasInteres || []), ""],
      },
    }));
  };

  const removeAreaInteres = (index) => {
    setProfileData((prev) => {
      const updatedAreasInteres =
        prev.interesesProfesionales?.areasInteres?.filter((_, i) => i !== index) || [];
      return {
        ...prev,
        interesesProfesionales: {
          ...prev.interesesProfesionales,
          areasInteres: updatedAreasInteres,
        },
      };
    });
  };

  const handleIdiomasChange = (index, field, value) => {
    setProfileData((prev) => {
      const updatedIdiomas = [...(prev.habilidades?.idiomas || [])];
      updatedIdiomas[index] = { ...updatedIdiomas[index], [field]: value };
      return {
        ...prev,
        habilidades: {
          ...prev.habilidades,
          idiomas: updatedIdiomas,
        },
      };
    });
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

  const removeIdioma = (index) => {
    setProfileData((prev) => {
      const updatedIdiomas = prev.habilidades?.idiomas?.filter(
        (_, i) => i !== index
      ) || [];
      return {
        ...prev,
        habilidades: {
          ...prev.habilidades,
          idiomas: updatedIdiomas,
        },
      };
    });
  };

  // Removed experience-related functions as they're no longer needed

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (!userData.nombreCompleto.trim()) {
        toast.error("El nombre completo es requerido");
        setIsLoading(false);
        return;
      }

      if (!userData.anioEgreso) {
        toast.error("El año de egreso es requerido");
        setIsLoading(false);
        return;
      }

      if (!userData.carrera) {
        toast.error("La carrera es requerida");
        setIsLoading(false);
        return;
      }

      // First, update user academic data
      const cleanUserData = {
        anioEgreso: userData.anioEgreso,
        carrera: userData.carrera,
        gradoAcademico: userData.gradoAcademico || "Bachiller",
      };

      console.log("Updating user academic data:", cleanUserData);
      await userApi.updateAcademicData(cleanUserData);

      // Then, create/update profile with professional preferences
      const cleanProfileData = {
        nombreCompleto: userData.nombreCompleto.trim(),
        interesesProfesionales: {
          ...profileData.interesesProfesionales,
          modalidad: profileData.interesesProfesionales?.modalidad || "Presencial",
          tipoJornada: profileData.interesesProfesionales?.tipoJornada || "Tiempo completo",
        },
        habilidades: {
          ...profileData.habilidades,
          idiomas: profileData.habilidades?.idiomas?.filter(idioma => 
            idioma.idioma && idioma.nivel
          ) || []
        },
        ubicacion: {
          ...profileData.ubicacion,
          distritoResidencia: profileData.ubicacion?.distritoResidencia || "Cercado de Lima",
        }
      };

      console.log("Updating profile data:", cleanProfileData);
      await createOrUpdateGraduateProfileRequest(cleanProfileData);
      
      navigate("/welcome-egresado");
      toast.success("Perfil guardado exitosamente!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(error.response?.data?.error || "Error al guardar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Cargando datos del perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center ">
      <div className="bg-white w-full max-w-4xl p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Mi Perfil
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Aquí puedes ver y actualizar tu información como egresado URPex.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Academic Information Section - User fields */}
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h2 className="text-lg font-semibold text-blue-800 mb-3">Información Académica</h2>
            
            {/* Nombre Completo - Auto-filled from user context */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Nombre Completo
              </label>
              <input
                type="text"
                name="nombreCompleto"
                value={userData.nombreCompleto}
                onChange={handleUserChange}
                className="w-full mt-1 p-2 border rounded bg-gray-100 text-gray-700"
                placeholder="Nombre del usuario logueado"
                readOnly
                title="Este campo se llena automáticamente con tu nombre de usuario"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Año de Egreso
              </label>
              <input
                type="number"
                name="anioEgreso"
                value={userData.anioEgreso}
                onChange={handleUserChange}
                className="w-full mt-1 p-2 border rounded bg-white text-gray-700"
                required
                min="1950"
                max={new Date().getFullYear() + 5}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Carrera
              </label>
              <select
                name="carrera"
                value={userData.carrera}
                onChange={handleUserChange}
                className="w-full mt-1 p-2 border rounded bg-white text-gray-700"
                required
              >
                <option value="">Seleccione una carrera</option>
                {options.carreras.map((carrera) => (
                  <option key={carrera} value={carrera}>
                    {carrera}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Grado Académico
              </label>
              <select
                name="gradoAcademico"
                value={userData.gradoAcademico}
                onChange={handleUserChange}
                className="w-full mt-1 p-2 border rounded bg-white text-gray-700"
                required
              >
                <option value="">Seleccione un grado académico</option>
                {options.gradosAcademicos.map((grado) => (
                  <option key={grado} value={grado}>
                    {grado}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Professional Preferences Section - Profile fields */}
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <h2 className="text-lg font-semibold text-green-800 mb-3">Preferencias Profesionales</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Áreas de Interés
              </label>
              {(profileData.interesesProfesionales?.areasInteres || []).map((area, index) => (
                <div key={index} className="flex space-x-4 items-center mb-2">
                  {/* Dropdown for Areas de Interés */}
                  <select
                    value={area}
                    onChange={(e) => {
                      const value = e.target.value;
                      setProfileData((prev) => {
                        const updatedAreasInteres = [
                          ...(prev.interesesProfesionales?.areasInteres || []),
                        ];
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
                    className="w-full p-2 border rounded bg-white text-gray-700"
                    required
                  >
                    <option value="">Seleccione un área de interés</option>
                  {options.areasInteres.map((areaOption) => (
                    <option key={areaOption} value={areaOption}>
                      {areaOption}
                    </option>
                  ))}
                </select>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeAreaInteres(index)}
                  className="hover:text-gray-300"
                >
                  Eliminar
                </button>
              </div>
            ))}

              {/* Add Button */}
              <button
                type="button"
                onClick={addAreaInteres}
                className="mt-2 hover:text-gray-300"
              >
                Agregar Área de Interés
              </button>
            </div>

            {/* Modalidad */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Modalidad Preferida de Empleo
              </label>
              <select
                name="modalidad"
                value={profileData.interesesProfesionales?.modalidad || ""}
                onChange={(e) => handleNestedChange(e, "interesesProfesionales")}
                className="w-full mt-1 p-2 border rounded bg-white text-gray-700"
                required
              >
                <option value="">Seleccione una modalidad</option>
                {options.modalidades.map((modalidad) => (
                  <option key={modalidad} value={modalidad}>
                    {modalidad}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo de Jornada */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Jornada
              </label>
              <select
                name="tipoJornada"
                value={profileData.interesesProfesionales?.tipoJornada || ""}
                onChange={(e) => handleNestedChange(e, "interesesProfesionales")}
                className="w-full mt-1 p-2 border rounded bg-white text-gray-700"
                required
              >
                <option value="">Seleccione un tipo de jornada</option>
              {options.tiposJornada.map((jornada) => (
                <option key={jornada} value={jornada}>
                  {jornada}
                </option>
              ))}
            </select>
          </div>

            {/* Idiomas */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Idiomas que maneja
              </label>
              {(profileData.habilidades?.idiomas || []).map((idiomaObj, index) => (
              <div key={index} className="flex space-x-4 items-center mb-2">
                {/* Idioma Dropdown */}
                <select
                  value={idiomaObj.idioma}
                  onChange={(e) =>
                    handleIdiomasChange(index, "idioma", e.target.value)
                  }
                  className="w-1/2 p-2 border rounded bg-white text-gray-700"
                  required
                >
                  <option value="">Seleccione un idioma</option>
                  {options.idiomas.map((idioma) => (
                    <option key={idioma} value={idioma}>
                      {idioma}
                    </option>
                  ))}
                </select>

                {/* Nivel Dropdown */}
                <select
                  value={idiomaObj.nivel}
                  onChange={(e) =>
                    handleIdiomasChange(index, "nivel", e.target.value)
                  }
                  className="w-1/2 p-2 border rounded bg-white text-gray-700"
                  required
                >
                  <option value="">Seleccione un nivel</option>
                  <option value="Básico">Básico</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                  <option value="Nativo">Nativo</option>
                </select>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeIdioma(index)}
                  className="hover:text-gray-300"
                >
                  Eliminar
                </button>
              </div>
            ))}

              {/* Add Button */}
              <button
                type="button"
                onClick={addIdioma}
                className="mt-2 hover:text-gray-300"
              >
                Agregar Idioma
              </button>
            </div>

            {/* Distrito de Residencia */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Distrito de Residencia
              </label>
              <select
                name="distritoResidencia"
                value={profileData.ubicacion?.distritoResidencia || ""}
                onChange={(e) => handleNestedChange(e, "ubicacion")}
                className="w-full mt-1 p-2 border rounded bg-white text-gray-700"
                required
              >
                <option value="">Seleccione un distrito</option>
                {options.distritosResidencia.map((distrito) => (
                  <option key={distrito} value={distrito}>
                    {distrito}
                  </option>
                ))}
              </select>
            </div>

            {/* Disponibilidad para Reubicación */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
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

            {/* Disponibilidad para Viajar */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
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

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 rounded mt-4"
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : "Guardar Perfil"}
          </button>
        </form>
      </div>
    </div>
  );
}
