const PerfilEgresado = require("../models/PerfilEgresado");

// Create or update graduate profile
const createOrUpdatePerfil = async (req, res) => {
  const firebaseUid = req.user.firebaseUid;
  const profileData = req.body;

  try {
    // Check if the profile already exists
    let profile = await PerfilEgresado.findOne({ firebaseUid });

    if (profile) {
      // Update existing profile
      Object.assign(profile, profileData);
      profile.updatedAt = Date.now();
      await profile.save();
      return res.json({ message: "Perfil actualizado exitosamente", profile });
    }

    // Create a new profile
    profile = new PerfilEgresado({ firebaseUid, ...profileData });
    await profile.save();
    res.json({ message: "Perfil creado exitosamente", profile });
  } catch (error) {
    console.error("Error creando/actualizando perfil:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Get graduate profile
const getPerfil = async (req, res) => {
  
  try {
    const userId = req.user.uid; // Extract the user's UID from the token
    const profile = await PerfilEgresado.findOne({ firebaseUid: userId });

    if (!profile) {
      return res.status(404).json({ error: "Perfil no encontrado" });
    }
    res.json(profile);
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Get options for the form
const getOptions = (req, res) => {
  try {
    const options = {
      carreras: [
        "Administración y Gerencia",
        "Administración de Negocios Globales",
        "Arquitectura",
        "Biología",
        "Contabilidad y Finanzas",
        "Derecho y Ciencia Política",
        "Economía",
        "Ingeniería Civil",
        "Ingeniería Electrónica",
        "Ingeniería Industrial",
        "Ingeniería Informática",
        "Ingeniería Mecatrónica",
        "Marketing Global y Administración Comercial",
        "Medicina Humana",
        "Medicina Veterinaria",
        "Psicología",
        "Traducción e Interpretación",
        "Turismo, Hotelería y Gastronomía",
      ],
      gradosAcademicos: ["Bachiller", "Titulado", "Magíster", "Doctorado"],
      aniosExperiencia: ["0–1 años", "2–3 años", "4–5 años", "Más de 5 años"],
      areasExperiencia: [
        "Finanzas",
        "Marketing",
        "Desarrollo de software",
        "Recursos Humanos",
        "Logística",
        "Atención al cliente",
        "Legal",
        "Educación",
      ],
      tiposEmpresa: ["Pública", "Privada", "ONG", "Startup", "Multinacional"],
      areasInteres: [
        "Innovación y tecnología",
        "Gestión empresarial",
        "Comercio exterior",
        "Educación y formación",
        "Emprendimiento",
        "Proyectos sociales",
      ],
      modalidades: ["Presencial", "Remoto", "Híbrido"],
      tiposJornada: ["Tiempo completo", "Medio tiempo", "Freelance"],
      idiomas: [
        "Español",
        "Inglés",
        "Portugués",
        "Frances",
        "Italiano",
        "Alemán",
        "Chino",
        "Japonés",
        "Ruso",
      ],
      distritosResidencia: [
        "Ancón",
        "Ate",
        "Barranco",
        "Breña",
        "Carabayllo",
        "Cercado de Lima",
        "Chaclacayo",
        "Chorrillos",
        "Cieneguilla",
        "Comas",
        "El Agustino",
        "Independencia",
        "Jesús María",
        "La Molina",
        "La Victoria",
        "Lince",
        "Los Olivos",
        "Lurigancho",
        "Lurín",
        "Magdalena del Mar",
        "Miraflores",
        "Pachacámac",
        "Pucusana",
        "Pueblo Libre",
        "Puente Piedra",
        "Punta Hermosa",
        "Punta Negra",
        "Rímac",
        "San Bartolo",
        "San Borja",
        "San Isidro",
        "San Juan de Lurigancho",
        "San Juan de Miraflores",
        "San Luis",
        "San Martín de Porres",
        "San Miguel",
        "Santa Anita",
        "Santa María del Mar",
        "Santa Rosa",
        "Santiago de Surco",
        "Surquillo",
        "Villa El Salvador",
        "Villa María del Triunfo",
      ],
    };

    res.json(options);
  } catch (error) {
    console.error("Error fetching options:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  createOrUpdatePerfil,
  getPerfil,
  getOptions,
};
