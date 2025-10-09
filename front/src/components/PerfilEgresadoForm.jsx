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
  const { userName } = useUser();
  const [photo, setPhoto] = useState("/default-profile.png");

  // Estado base seguro
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

  // --- Carga inicial ---
  useEffect(() => {
    const fetchDataAndOptions = async () => {
      try {
        const optionsData = await OptionsRequest();
        setOptions(optionsData);

        const currentUser = await userApi.getCurrentUser();
        if (currentUser.user) {
          setUserData({
            nombreCompleto: currentUser.user.name || userName || "",
            anioEgreso: currentUser.user.anioEgreso || "",
            carrera: currentUser.user.carrera || "",
            gradoAcademico: currentUser.user.gradoAcademico || "",
          });
        }

        const profileResponse = await getGraduateProfileRequest();
        if (profileResponse) {
          // asegurar estructura completa
          setProfileData({
            interesesProfesionales: {
              areasInteres:
                profileResponse.interesesProfesionales?.areasInteres || [],
              modalidad:
                profileResponse.interesesProfesionales?.modalidad || "",
              tipoJornada:
                profileResponse.interesesProfesionales?.tipoJornada || "",
            },
            habilidades: {
              idiomas: profileResponse.habilidades?.idiomas || [],
            },
            ubicacion: {
              distritoResidencia:
                profileResponse.ubicacion?.distritoResidencia || "",
              disponibilidadReubicacion:
                profileResponse.ubicacion?.disponibilidadReubicacion || false,
              disponibilidadViajar:
                profileResponse.ubicacion?.disponibilidadViajar || false,
            },
          });
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setIsInitializing(false);
      }
    };
    fetchDataAndOptions();
  }, [userName]);

  // --- Manejo de foto ---
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  // --- Handlers ---
  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (e, parentKey) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [parentKey]: { ...prev[parentKey], [name]: value },
    }));
  };

  // --- Idiomas ---
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
      const idiomasSeguros = [...(prev.habilidades?.idiomas || [])];
      idiomasSeguros[index] = { ...idiomasSeguros[index], [field]: value };
      return {
        ...prev,
        habilidades: { ...prev.habilidades, idiomas: idiomasSeguros },
      };
    });
  };

  const removeIdioma = (index) => {
    setProfileData((prev) => {
      const seguros = [...(prev.habilidades?.idiomas || [])].filter(
        (_, i) => i !== index
      );
      return {
        ...prev,
        habilidades: { ...prev.habilidades, idiomas: seguros },
      };
    });
  };

  // --- Guardado ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!userData.nombreCompleto.trim())
        return toast.error("El nombre completo es requerido");
      if (!userData.anioEgreso)
        return toast.error("El año de egreso es requerido");
      if (!userData.carrera) return toast.error("La carrera es requerida");

      await userApi.updateAcademicData({
        anioEgreso: userData.anioEgreso,
        carrera: userData.carrera,
        gradoAcademico: userData.gradoAcademico || "Bachiller",
      });

      const cleanProfile = {
        nombreCompleto: userData.nombreCompleto.trim(),
        interesesProfesionales: {
          ...profileData.interesesProfesionales,
          modalidad:
            profileData.interesesProfesionales?.modalidad || "Presencial",
          tipoJornada:
            profileData.interesesProfesionales?.tipoJornada ||
            "Tiempo completo",
        },
        habilidades: {
          ...profileData.habilidades,
          idiomas:
            (profileData.habilidades?.idiomas || []).filter(
              (i) => i.idioma && i.nivel
            ) || [],
        },
        ubicacion: {
          ...profileData.ubicacion,
          distritoResidencia:
            profileData.ubicacion?.distritoResidencia || "Cercado de Lima",
        },
      };

      await createOrUpdateGraduateProfileRequest(cleanProfile);
      toast.success("Perfil guardado exitosamente!");
      navigate("/welcome-egresado");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Error al guardar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render ---
  return (
    <div className="w-full min-h-screen bg-[#1C1D21] text-white flex flex-col">
      <main className="flex flex-col md:flex-row flex-1 p-10 gap-10">
        {/* FOTO */}
        <div className="flex flex-col items-center md:w-1/3">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#00BC4F] shadow-lg">
            <img src={photo} alt="Foto de perfil" className="w-full h-full object-cover" />
          </div>
          <label
            htmlFor="photo"
            className="mt-4 px-4 py-2 bg-[#00BC4F] rounded-lg text-white font-semibold cursor-pointer hover:bg-green-600 transition"
          >
            Editar foto de perfil
          </label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>

        {/* FORMULARIO */}
        <div className="md:w-2/3 rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-[#00BC4F]">Perfil del Egresado</h2>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-6 text-left text-lg">
            {/* Datos Académicos */}
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
                <input
                  type="text"
                  name="carrera"
                  value={userData.carrera}
                  onChange={handleUserChange}
                  className="w-full mt-1 px-3 py-2 bg-[#2A2B30] border border-[#00BC4F] rounded-lg focus:ring-2 focus:ring-[#00BC4F]"
                />
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

            {/* Áreas de Interés */}
            <div>
              <label className="text-[#00BC4F] font-semibold block mb-2">Áreas de Interés:</label>
              {(profileData.interesesProfesionales?.areasInteres || []).map((area, index) => (
                <div key={index} className="flex space-x-4 items-center mb-2">
                  <select
                    value={area}
                    onChange={(e) => {
                      const value = e.target.value;
                      setProfileData((prev) => {
                        const updated = [...(prev.interesesProfesionales?.areasInteres || [])];
                        updated[index] = value;
                        return {
                          ...prev,
                          interesesProfesionales: {
                            ...prev.interesesProfesionales,
                            areasInteres: updated,
                          },
                        };
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Selecciona un área</option>
                    {(options.areasInteres || []).map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() =>
                      setProfileData((prev) => ({
                        ...prev,
                        interesesProfesionales: {
                          ...prev.interesesProfesionales,
                          areasInteres: (prev.interesesProfesionales?.areasInteres || []).filter(
                            (_, i) => i !== index
                          ),
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
            </div>

            {/* Idiomas */}
            <div>
              <label className="text-[#00BC4F] font-semibold block mb-2">Idiomas:</label>
              {(profileData.habilidades?.idiomas || []).map((idioma, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Idioma"
                    value={idioma?.idioma || ""}
                    onChange={(e) => handleIdiomasChange(index, "idioma", e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#2A2B30] border border-[#00BC4F] rounded-lg focus:ring-2 focus:ring-[#00BC4F]"
                  />
                  <input
                    type="text"
                    placeholder="Nivel"
                    value={idioma?.nivel || ""}
                    onChange={(e) => handleIdiomasChange(index, "nivel", e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#2A2B30] border border-[#00BC4F] rounded-lg focus:ring-2 focus:ring-[#00BC4F]"
                  />
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
            </div>

            {/* Botones */}
            <div className="flex justify-start mt-10 space-x-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-[#00BC4F] text-white rounded-lg font-semibold hover:bg-green-600 transition"
              >
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Volver
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
