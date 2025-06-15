import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createOrUpdateGraduateProfileRequest,
  getGraduateProfileRequest,
  OptionsRequest,
} from "../api/perfilEgresadoApi";
import { toast } from "react-hot-toast";

export default function PerfilEgresadoForm() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    nombreCompleto: "",
    anioEgreso: "",
    carrera: "",
    gradoAcademico: "",
    experienciaLaboral: {
      aniosExperiencia: "",
      areasExperiencia: [],
      tipoEmpresa: "",
    },
    interesesProfesionales: {
      areasInteres: [],
      modalidad: "",
      tipoJornada: "",
    },
    habilidades: {
      idiomas: [
        { idioma: "", nivel: "" }, // Default structure
      ],
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
    aniosExperiencia: [],
    areasExperiencia: [],
    tiposEmpresa: [],
    areasInteres: [],
    modalidades: [],
    tiposJornada: [],
    idiomas: [],
    distritosResidencia: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfileAndOptions = async () => {
      try {
        // Fetch options for dropdowns
        const optionsData = await OptionsRequest();
        setOptions(optionsData);
  
        // Fetch existing profile
        const profileResponse = await getGraduateProfileRequest();
        if (profileResponse) {
          setProfile(profileResponse); // Set profile if it exists
        }
      } catch (error) {
        if (error.response?.status === 404) {
          // Profile not found, allow user to create a new one
          console.warn("No profile found. User can create a new profile.");
        } else {
          console.error("Error fetching profile or options:", error);
        }
      }
    };
  
    fetchProfileAndOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (e, parentKey) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [name]: value,
      },
    }));
  };
  const addAreaInteres = () => {
    setProfile((prev) => ({
      ...prev,
      interesesProfesionales: {
        ...prev.interesesProfesionales,
        areasInteres: [...prev.interesesProfesionales.areasInteres, ""],
      },
    }));
  };

  const removeAreaInteres = (index) => {
    setProfile((prev) => {
      const updatedAreasInteres =
        prev.interesesProfesionales.areasInteres.filter((_, i) => i !== index);
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
    setProfile((prev) => {
      const updatedIdiomas = [...prev.habilidades.idiomas];
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
    setProfile((prev) => ({
      ...prev,
      habilidades: {
        ...prev.habilidades,
        idiomas: [...prev.habilidades.idiomas, { idioma: "", nivel: "" }],
      },
    }));
  };

  const removeIdioma = (index) => {
    setProfile((prev) => {
      const updatedIdiomas = prev.habilidades.idiomas.filter(
        (_, i) => i !== index
      );
      return {
        ...prev,
        habilidades: {
          ...prev.habilidades,
          idiomas: updatedIdiomas,
        },
      };
    });
  };

  const handleAreaExperienciaChange = (index, value) => {
    setProfile((prev) => {
      const updatedAreasExperiencia = [
        ...prev.experienciaLaboral.areasExperiencia,
      ];
      updatedAreasExperiencia[index] = value;
      return {
        ...prev,
        experienciaLaboral: {
          ...prev.experienciaLaboral,
          areasExperiencia: updatedAreasExperiencia,
        },
      };
    });
  };

  const addAreaExperiencia = () => {
    setProfile((prev) => ({
      ...prev,
      experienciaLaboral: {
        ...prev.experienciaLaboral,
        areasExperiencia: [...prev.experienciaLaboral.areasExperiencia, ""],
      },
    }));
  };

  const removeAreaExperiencia = (index) => {
    setProfile((prev) => {
      const updatedAreasExperiencia =
        prev.experienciaLaboral.areasExperiencia.filter((_, i) => i !== index);
      return {
        ...prev,
        experienciaLaboral: {
          ...prev.experienciaLaboral,
          areasExperiencia: updatedAreasExperiencia,
        },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createOrUpdateGraduateProfileRequest(profile);
      navigate("/welcome-egresado");
      toast.success("Perfil guardado exitosamente!");
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
          {/* Nombre Completo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre Completo
            </label>
            <input
              type="text"
              name="nombreCompleto"
              value={profile.nombreCompleto}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded bg-white text-gray-700"
              disabled
            />
          </div>

          {/* Año de Egreso */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Año de Egreso
            </label>
            <input
              type="number"
              name="anioEgreso"
              value={profile.anioEgreso}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded bg-white text-gray-700"
              required
            />
          </div>

          {/* Carrera */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Carrera
            </label>
            <select
              name="carrera"
              value={profile.carrera}
              onChange={handleChange}
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

          {/* Grado Académico */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Grado Académico
            </label>
            <select
              name="gradoAcademico"
              value={profile.gradoAcademico}
              onChange={handleChange}
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

          {/* Experiencia Laboral */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Años de Experiencia
            </label>
            <select
              name="aniosExperiencia"
              value={profile.experienciaLaboral.aniosExperiencia}
              onChange={(e) => handleNestedChange(e, "experienciaLaboral")}
              className="w-full mt-1 p-2 border rounded bg-white text-gray-700"
              required
            >
              <option value="">Seleccione años de experiencia</option>
              {options.aniosExperiencia.map((anio) => (
                <option key={anio} value={anio}>
                  {anio}
                </option>
              ))}
            </select>
          </div>

          {/* Areas de Experiencia */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Áreas de Experiencia
            </label>
            {profile.experienciaLaboral.areasExperiencia.map((area, index) => (
              <div key={index} className="flex space-x-4 items-center mb-2">
                {/* Dropdown for Areas de Experiencia */}
                <select
                  value={area}
                  onChange={(e) =>
                    handleAreaExperienciaChange(index, e.target.value)
                  }
                  className="w-full p-2 border rounded bg-white text-gray-700"
                  required
                >
                  <option value="">Seleccione un área de experiencia</option>
                  {options.areasExperiencia.map((areaOption) => (
                    <option key={areaOption} value={areaOption}>
                      {areaOption}
                    </option>
                  ))}
                </select>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeAreaExperiencia(index)}
                  className="hover:text-gray-300"
                >
                  Eliminar
                </button>
              </div>
            ))}

            {/* Add Button */}
            <button
              type="button"
              onClick={addAreaExperiencia}
              className="mt-2 hover:text-gray-300"
            >
              Agregar Área de Experiencia
            </button>
          </div>

          {/* Tipo de Empresa */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Empresa
            </label>
            <select
              name="tipoEmpresa"
              value={profile.experienciaLaboral.tipoEmpresa}
              onChange={(e) => handleNestedChange(e, "experienciaLaboral")}
              className="w-full mt-1 p-2 border rounded bg-white text-gray-700"
              required
            >
              <option value="">Seleccione un tipo de empresa</option>
              {options.tiposEmpresa.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          {/* Areas de Interés */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Áreas de Interés
            </label>
            {profile.interesesProfesionales.areasInteres.map((area, index) => (
              <div key={index} className="flex space-x-4 items-center mb-2">
                {/* Dropdown for Areas de Interés */}
                <select
                  value={area}
                  onChange={(e) => {
                    const value = e.target.value;
                    setProfile((prev) => {
                      const updatedAreasInteres = [
                        ...prev.interesesProfesionales.areasInteres,
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
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Modalidad Preferida de Empleo
            </label>
            <select
              name="modalidad"
              value={profile.interesesProfesionales.modalidad}
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
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Jornada
            </label>
            <select
              name="tipoJornada"
              value={profile.interesesProfesionales.tipoJornada}
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
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Idiomas que maneja
            </label>
            {profile.habilidades.idiomas.map((idiomaObj, index) => (
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
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Distrito de Residencia
            </label>
            <select
              name="distritoResidencia"
              value={profile.ubicacion.distritoResidencia}
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
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Disponibilidad para Reubicación
            </label>
            <input
              type="checkbox"
              name="disponibilidadReubicacion"
              checked={profile.ubicacion.disponibilidadReubicacion}
              onChange={(e) =>
                setProfile((prev) => ({
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
              checked={profile.ubicacion.disponibilidadViajar}
              onChange={(e) =>
                setProfile((prev) => ({
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
