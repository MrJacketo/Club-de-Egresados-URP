import { useState } from "react";

export default function PerfilEgresadoForm() {
  const navigate = useNavigate();
  const { userName } = useUser();
  const [photo, setPhoto] = useState("/default-profile.png");

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
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setIsInitializing(false);
      }
    };
    fetchDataAndOptions();
  }, [userName]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!userData.nombreCompleto.trim()) return toast.error("El nombre completo es requerido");
      if (!userData.anioEgreso) return toast.error("El año de egreso es requerido");
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

  return (
    <div className="w-full min-h-screen bg-white text-gray-900 flex flex-col">
      <main className="flex flex-col md:flex-row flex-1 p-10 gap-10">
        {/* FOTO */}
        <div className="flex flex-col items-center md:w-1/3">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-green-500 shadow-lg bg-white">
            <img src={photo} alt="Foto de perfil" className="w-full h-full object-cover" />
          </div>
          <label
            htmlFor="photo"
            className="mt-4 px-4 py-2 bg-green-500 rounded-lg text-white font-semibold cursor-pointer hover:bg-green-600 transition-colors"
          >
            Editar foto de perfil
          </label>
          <input type="file" id="photo" accept="image/*" className="hidden" onChange={handlePhotoChange} />
        </div>

        {/* FORMULARIO */}
        <div className="md:w-2/3 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">Perfil del Egresado</h2>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-6 text-left text-lg">
            {/* DATOS ACADÉMICOS */}
            <div>
              <label className="text-green-600 font-semibold block">Nombre completo:</label>
              <input
                type="text"
                name="nombreCompleto"
                value={userData.nombreCompleto}
                onChange={handleUserChange}
                className="w-full mt-1 px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-green-600 font-semibold block">Año de egreso:</label>
                <input
                  type="number"
                  name="anioEgreso"
                  value={userData.anioEgreso}
                  onChange={handleUserChange}
                  className="w-full mt-1 px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="text-green-600 font-semibold block">Carrera:</label>
                <input
                  type="text"
                  name="carrera"
                  value={userData.carrera}
                  onChange={handleUserChange}
                  className="w-full mt-1 px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label className="text-green-600 font-semibold block">Grado Académico:</label>
              <input
                type="text"
                name="gradoAcademico"
                value={userData.gradoAcademico}
                onChange={handleUserChange}
                className="w-full mt-1 px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* INTERESES PROFESIONALES */}
            <div>
              <label className="text-green-600 font-semibold block mb-2">Áreas de Interés:</label>
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
                    className="w-full mt-1 p-2 border border-gray-300 bg-white rounded text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
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
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                + Añadir área
              </button>

              {/* NUEVAS OPCIONES - Modalidad y Jornada */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-green-600">Modalidad Preferida de Empleo</label>
                <select
                  name="modalidad"
                  value={profileData.interesesProfesionales?.modalidad || ""}
                  onChange={(e) => handleNestedChange(e, "interesesProfesionales")}
                  className="w-full mt-1 p-2 border border-gray-300 bg-white rounded text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                <label className="block text-sm font-medium text-green-600">Tipo de Jornada</label>
                <select
                  name="tipoJornada"
                  value={profileData.interesesProfesionales?.tipoJornada || ""}
                  onChange={(e) => handleNestedChange(e, "interesesProfesionales")}
                  className="w-full mt-1 p-2 border border-gray-300 bg-white rounded text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
              <label className="text-green-600 font-semibold block mb-2">Idiomas:</label>
              {(profileData.habilidades?.idiomas || []).map((idioma, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Idioma"
                    value={idioma.idioma}
                    onChange={(e) => handleIdiomasChange(index, "idioma", e.target.value)}
                    className="flex-1 px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <input
                    type="text"
                    placeholder="Nivel"
                    value={idioma.nivel}
                    onChange={(e) => handleIdiomasChange(index, "nivel", e.target.value)}
                    className="flex-1 px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeIdioma(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addIdioma}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                + Añadir idioma
              </button>

              {/* NUEVAS OPCIONES - Ubicación */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-green-600">
                  Distrito de Residencia
                </label>
                <select
                  name="distritoResidencia"
                  value={profileData.ubicacion?.distritoResidencia || ""}
                  onChange={(e) => handleNestedChange(e, "ubicacion")}
                  className="w-full mt-1 p-2 border border-gray-300 bg-white rounded text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                <label className="flex items-center text-sm font-medium text-green-600 cursor-pointer">
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
                    className="mr-2 w-4 h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                  />
                  Disponibilidad para Reubicación
                </label>
              </div>

              <div className="mt-4">
                <label className="flex items-center text-sm font-medium text-green-600 cursor-pointer">
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
                    className="mr-2 w-4 h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                  />
                  Disponibilidad para Viajar
                </label>
              </div>
            </div>

           {/* BOTONES */}
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 rounded-lg text-white font-semibold transition-colors ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
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

