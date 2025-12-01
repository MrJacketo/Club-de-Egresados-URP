const OfertaLaboral = require("../models/OfertaLaboral")
const User = require("../models/User")
const Postulacion = require("../models/Postulacion");
const PublicacionOfertas = require("../models/PublicacionOfertas");
const { AREAS_LABORALES, TIPOS_CONTRATO, MODALIDAD, REQUISITOS, ESTADO } = require('../enums/OfertaLaboral.enum');
const { v4: uuidv4 } = require("uuid");
const { uploadCV, deleteCV, getSignedUrlForCV } = require("../utils/supabaseStorage");
// Firebase bucket removed - replaced with Supabase Storage
// const bucket = require("../firebase");


// Crear o actualizar una oferta laboral
const createOrUpdateOferta = async (req, res) => {
  const { id } = req.params;
  const { ofertaData } = req.body;

  try {
    console.log('=== CREATE OR UPDATE OFERTA ===');
    console.log('ID:', id);
    console.log('Request body:', req.body);
    console.log('Oferta data:', ofertaData);
    console.log('User from JWT:', req.user ? req.user._id : 'No user');

    if (id) {
      const oferta = await OfertaLaboral.findByIdAndUpdate(
        id,
        { ...ofertaData, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      if (!oferta) return res.status(404).json({ error: 'Oferta no encontrada' });

      return res.json({ message: 'Oferta laboral actualizada exitosamente', oferta });
    }

    // Si no hay id, crear oferta y asociar perfil
    // Usar req.user que viene del middleware JWT
    const userId = req.user._id;
    console.log('User ID from JWT:', userId);
    
    const perfil = await User.findById(userId);
    if (!perfil) {
      console.error('Perfil no encontrado para userId:', userId);
      return res.status(404).json({ error: 'Perfil de usuario no encontrado' });
    }

    console.log('Perfil encontrado:', perfil.email);

    // Validar datos antes de crear la oferta
    if (!ofertaData || !ofertaData.cargo || !ofertaData.empresa || !ofertaData.modalidad) {
      console.error('Faltan campos obligatorios:', { 
        cargo: ofertaData?.cargo, 
        empresa: ofertaData?.empresa, 
        modalidad: ofertaData?.modalidad 
      });
      return res.status(400).json({ 
        error: 'Faltan campos obligatorios',
        details: 'Los campos cargo, empresa y modalidad son requeridos'
      });
    }

    // Limpiar campos opcionales que vienen vacíos
    const cleanedOfertaData = { ...ofertaData };
    
    // Si requisitos viene vacío, usar el valor por defecto del modelo
    if (!cleanedOfertaData.requisitos || cleanedOfertaData.requisitos.trim() === '') {
      console.log('Requisitos vacío, se eliminará para usar valor por defecto');
      delete cleanedOfertaData.requisitos; // Dejará que el modelo use su valor por defecto
    }
    
    // Si area viene vacío, no incluirlo
    if (!cleanedOfertaData.area || cleanedOfertaData.area.trim() === '') {
      console.log('Area vacía, se eliminará');
      delete cleanedOfertaData.area;
    }

    // Crear la nueva oferta con valores por defecto si es necesario
    const nuevaOfertaData = {
      ...cleanedOfertaData,
      estado: cleanedOfertaData.estado || 'Pendiente',
      aprobado: cleanedOfertaData.aprobado || false
    };

    console.log('Datos finales para crear oferta:', nuevaOfertaData);

    //guardo la nueva oferta
    const nuevaOferta = new OfertaLaboral(nuevaOfertaData);
    await nuevaOferta.save();

    console.log('Oferta guardada exitosamente:', nuevaOferta._id);

    const nuevaPublicacion = new PublicacionOfertas({
      ofertaLaboral: nuevaOferta._id,
      perfil: perfil._id
    });
    await nuevaPublicacion.save();

    console.log('Publicación creada:', nuevaPublicacion._id);

    res.json({ message: 'Oferta laboral creada exitosamente', oferta: nuevaOferta });
  } catch (error) {
    console.error('Error creando/actualizando oferta laboral:', error);
    
    // Manejo específico de errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      console.error('Errores de validación:', validationErrors);
      return res.status(400).json({ 
        error: 'Error de validación', 
        details: validationErrors.join(', ')
      });
    }
    
    res.status(500).json({ 
      error: 'Error interno del servidor', 
      details: error.message 
    });
  }
};



// Obtener una oferta laboral por ID
const getOferta = async (req, res) => {
  const { id } = req.params;  // ID de la oferta laboral

  try {
    const oferta = await OfertaLaboral.findById(id);  // Buscar la oferta por su ID
    if (!oferta) {
      return res.status(404).json({ error: 'Oferta laboral no encontrada' });
    }
    res.json(oferta);  // Si se encuentra, devolver la oferta
  } catch (error) {
    console.error('Error obteniendo la oferta laboral:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener todas las ofertas laborales
const getOfertas = async (req, res) => {
  try {
    // Solo mostrar ofertas que estén activas Y aprobadas
    const ofertas = await OfertaLaboral.find({ estado: "Activo", aprobado: true });
    res.json(ofertas);
  } catch (error) {
    console.error('Error obteniendo las ofertas laborales:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Deshabilitar una oferta laboral (cambiar el estado a "Inactivo")
const disableOferta = async (req, res) => {
  const { id } = req.params;

  try {
    const oferta = await OfertaLaboral.findById(id);

    if (!oferta) {
      return res.status(404).json({ error: 'Oferta laboral no encontrada' });
    }

    const nuevoEstado = oferta.estado === 'Activo' ? 'Inactivo' : 'Activo';

    const updatedOferta = await OfertaLaboral.findByIdAndUpdate(id, { estado: nuevoEstado }, { new: true });

    res.json({ message: `Oferta laboral ${nuevoEstado} exitosamente`, estado: updatedOferta.estado });
  } catch (error) {
    console.error('Error al cambiar el estado de la oferta laboral:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


// Eliminar una oferta laboral por ID
const deleteOferta = async (req, res) => {
  const { id } = req.params;  // ID de la oferta laboral a eliminar

  try {
    const oferta = await OfertaLaboral.findByIdAndDelete(id);  // Eliminar la oferta por su ID
    if (!oferta) {
      return res.status(404).json({ error: 'Oferta laboral no encontrada' });
    }
    res.json({ message: 'Oferta laboral eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminando la oferta laboral:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para obtener las opciones de los enums
const getOptions = (req, res) => {
  try {
    res.json({
      areasLaborales: AREAS_LABORALES,
      tiposContrato: TIPOS_CONTRATO,
      modalidades: MODALIDAD,
      requisitos: REQUISITOS,
      estado: ESTADO
    });
  } catch (error) {
    console.error("Error obteniendo opciones:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};



//postular oferta
const postularOferta = async (req, res) => {
  console.log('postularOferta called with id:', req.params.id);
  console.log('postularOferta req.user:', req.user);
  console.log('postularOferta req.body:', req.body);
  console.log('postularOferta req.file:', req.file);

  const { id } = req.params;
  const { correo, numero } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'Se requiere el archivo PDF del CV.' });
  }

  try {
    // Get user from JWT token
    const userId = req.user._id;
    console.log('userId from JWT:', userId);

    // Ejecutar en paralelo
    const [oferta, perfil] = await Promise.all([
      OfertaLaboral.findById(id),
      User.findById(userId),
    ]);

    if (!oferta) {
      return res.status(404).json({ error: 'Oferta no encontrada' });
    }
    if (!perfil) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    // Verificar si ya postuló
    const yaPostulo = await Postulacion.findOne({
      ofertaLaboral: id,
      perfil: perfil._id,
    });

    if (yaPostulo) {
      return res.status(400).json({ error: 'Ya has postulado a esta oferta' });
    }

    // Subir CV a Supabase Storage
    let cvData = null;
    try {
      cvData = await uploadCV(req.file, userId);
      console.log('CV subido exitosamente:', cvData);
    } catch (uploadError) {
      console.error('Error al subir CV:', uploadError);
      return res.status(500).json({ error: 'Error al subir el curriculum vitae' });
    }

    // Crear registro en colección Postulacion
    const nuevaPostulacion = new Postulacion({
      ofertaLaboral: oferta._id,
      perfil: perfil._id,
      correo,
      numero,
      cv: req.file.originalname,
      cvUrl: cvData.url,
      cvFileName: cvData.fileName,
      cvFilePath: cvData.filePath,
    });

    await nuevaPostulacion.save();

    res.json({ message: 'Postulación realizada con éxito' });
  } catch (error) {
    console.error('Error al postular a la oferta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};



const verificarPostulacion = async (req, res) => {
  const { uid } = req.params;

  try {
    // Buscar el perfil por el ID de usuario
    const perfil = await User.findById(uid);
    if (!perfil) return res.status(404).json({ error: 'Perfil no encontrado' });

    // Buscar todas las postulaciones realizadas por este perfil
    const postulaciones = await Postulacion.find({ perfil: perfil._id }).select('ofertaLaboral');

    // Extraer solo los IDs de las ofertas
    const ids = postulaciones.map((postulacion) => postulacion.ofertaLaboral);

    res.json({ ofertasPostuladas: ids });
  } catch (error) {
    console.error('Error al verificar postulación:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};



// Obtener los postulantes de una oferta laboral

const getPostulantesDeOferta = async (req, res) => {
  try {
    const { idOferta } = req.params;

    // Buscar todas las postulaciones que referencian la oferta
    const postulaciones = await Postulacion.find({ ofertaLaboral: idOferta }).populate('perfil');

    if (!postulaciones.length) {
      return res.status(404).json({ message: "No hay postulaciones para esta oferta." });
    }

    // Mapear para devolver datos limpios
    const postulantes = postulaciones.map((postulacion) => ({
      idPostulacion: postulacion._id,
      _id: postulacion.perfil?._id,
      nombreCompleto: postulacion.perfil?.name || "Nombre no registrado",
      correo: postulacion.correo,
      numero: postulacion.numero,
      cv: postulacion.cv || null,
      cvUrl: postulacion.cvUrl || null,
      cvFileName: postulacion.cvFileName || null,
      cvFilePath: postulacion.cvFilePath || null,
      apto: postulacion.apto
    }));

    return res.json(postulantes);
  } catch (error) {
    console.error("Error al obtener postulantes:", error);
    return res.status(500).json({ message: "Error interno al obtener postulantes." });
  }
};

//obtener ofertas creadas por un usuario
const getOfertasCreadasPorUsuario = async (req, res) => {
  const { uid } = req.params;

  try {
    // Buscar el perfil del usuario por su ID
    const perfil = await User.findById(uid);
    if (!perfil) {
      return res.status(404).json({ error: 'Perfil de usuario no encontrado' });
    }

    // Buscar las publicaciones donde el perfil coincida
    const publicaciones = await PublicacionOfertas.find({ perfil: perfil._id }).populate('ofertaLaboral');

    // Extraer solo las ofertas laborales
    const ofertas = publicaciones.map(pub => pub.ofertaLaboral);

    res.json(ofertas);
  } catch (error) {
    console.error('Error obteniendo ofertas creadas por el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


// Actualizar el estado 'apto' de una postulación
const updateAptoPostulacion = async (req, res) => {
  const { idPostulacion } = req.params;
  const { apto } = req.body;

  try {
    // Validar que el valor de apto sea booleano
    if (typeof apto !== 'boolean') {
      return res.status(400).json({ error: 'El campo apto debe ser un valor booleano (true/false)' });
    }

    // Buscar y actualizar la postulación
    const postulacion = await Postulacion.findByIdAndUpdate(
      idPostulacion,
      { apto },
      { new: true }
    ).populate('perfil').populate('ofertaLaboral');

    if (!postulacion) {
      return res.status(404).json({ error: 'Postulación no encontrada' });
    }

    res.json({
      message: `Postulación marcada como ${apto ? 'apto' : 'no apto'} exitosamente`,
      postulacion
    });
  } catch (error) {
    console.error('Error actualizando el estado apto de la postulación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Descargar CV de una postulación
const downloadCV = async (req, res) => {
  try {
    const { postulacionId } = req.params;
    
    // Buscar la postulación
    const postulacion = await Postulacion.findById(postulacionId);
    if (!postulacion) {
      return res.status(404).json({ error: 'Postulación no encontrada' });
    }
    
    if (!postulacion.cvFilePath) {
      return res.status(404).json({ error: 'No hay CV asociado a esta postulación' });
    }
    
    // Generar URL firmada para descarga (válida por 1 hora)
    const signedUrl = await getSignedUrlForCV(postulacion.cvFilePath, 3600);
    
    res.json({ 
      downloadUrl: signedUrl,
      fileName: postulacion.cvFileName || postulacion.cv,
      message: 'URL de descarga generada exitosamente'
    });
    
  } catch (error) {
    console.error('Error al generar URL de descarga:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};




module.exports = {
  createOrUpdateOferta,
  getOferta,
  getOfertas,
  disableOferta,
  deleteOferta,
  getOptions,
  postularOferta,
  verificarPostulacion,
  getPostulantesDeOferta,
  getOfertasCreadasPorUsuario,
  updateAptoPostulacion, // nueva función
  downloadCV // nueva función para descargar CVs
};
