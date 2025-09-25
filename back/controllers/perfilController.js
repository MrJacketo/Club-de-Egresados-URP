const PerfilEgresado = require("../models/PerfilEgresado");
const User = require("../models/User");

// Helper function to get enum values from User schema
const getUserSchemaEnums = () => {
  const userSchema = User.schema;
  return {
    carreras: userSchema.paths.carrera.enumValues || [],
    gradosAcademicos: userSchema.paths.gradoAcademico.enumValues || []
  };
};

// Create or update graduate profile
const createOrUpdatePerfil = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const userId = req.user._id;
    const data = req.body;

    // Profile data only (academic data is now handled by authController)
    const profileData = {};

    // Only handle profile-specific data, exclude academic fields and nombreCompleto
    const excludedFields = ['anioEgreso', 'carrera', 'gradoAcademico', 'nombreCompleto'];
    Object.keys(data).forEach(key => {
      if (!excludedFields.includes(key)) {
        profileData[key] = data[key];
      }
    });

    console.log('=== CREATE/UPDATE PROFILE ===');
    console.log('User ID:', userId);
    console.log('Profile data to save:', profileData);

    // Check if the profile already exists
    let profile = await PerfilEgresado.findOne({ userId });

    if (profile) {
      // Update existing profile
      Object.assign(profile, profileData);
      await profile.save();
    } else {
      // Create a new profile
      profile = new PerfilEgresado({ userId, ...profileData });
      await profile.save();
    }

    // Get updated user data to return complete info
    const updatedUser = await User.findById(userId).select('-password');
    
    res.json({ 
      message: profile.isNew ? "Perfil creado exitosamente" : "Perfil actualizado exitosamente", 
      profile,
      user: updatedUser 
    });
  } catch (error) {
    console.error("Error creando/actualizando perfil:", error);
    res.status(500).json({ error: "Error interno del servidor", details: error.message });
  }
};

// Get graduate profile
const getPerfil = async (req, res) => {
  const userId = req.user._id;

  try {
    // Get both profile and user data
    const profile = await PerfilEgresado.findOne({ userId });
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Combine user academic data with profile data
    const completeProfile = {
      // User academic data
      nombreCompleto: user.name,
      anioEgreso: user.anioEgreso,
      carrera: user.carrera,
      gradoAcademico: user.gradoAcademico,
      // Profile data (if exists)
      ...(profile ? profile.toObject() : {}),
      userId: user._id
    };

    res.json(completeProfile);
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Get options for the form
const getOptions = (req, res) => {
  try {
    // Get enums from User schema to maintain consistency
    const userEnums = getUserSchemaEnums();
    
    console.log('=== OPTIONS REQUEST ===');
    console.log('Grados académicos desde User schema:', userEnums.gradosAcademicos);
    
    const options = {
      carreras: userEnums.carreras,
      gradosAcademicos: userEnums.gradosAcademicos,
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
