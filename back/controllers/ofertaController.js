const OfertaLaboral = require("../models/OfertaLaboral")
const User = require("../models/User")
const Postulacion = require("../models/Postulacion");
const PublicacionOfertas = require("../models/PublicacionOfertas");
const { AREAS_LABORALES, TIPOS_CONTRATO, MODALIDAD, REQUISITOS, ESTADO } = require('../enums/OfertaLaboral.enum');
const { v4: uuidv4 } = require("uuid");
// Firebase bucket removed - using local file storage instead
// const bucket = require("../firebase");


// Crear o actualizar una oferta laboral
const createOrUpdateOferta = async (req, res) => {
  const { id } = req.params;
  const { ofertaData, uid } = req.body;

  try {
    if (id) {
      const oferta = await OfertaLaboral.findByIdAndUpdate(
        id,
        { ...ofertaData, updatedAt: Date.now() },
        { new: true }
      );
      if (!oferta) return res.status(404).json({ error: 'Oferta no encontrada' });

      return res.json({ message: 'Oferta laboral actualizada exitosamente', oferta });
    }

    // Si no hay id, crear oferta y asociar perfil
    const perfil = await User.findById(uid);
    if (!perfil) {
      return res.status(404).json({ error: 'Perfil de egresado no encontrado' });
    }

    //guardo la nueva oferta
    const nuevaOferta = new OfertaLaboral(ofertaData);
    await nuevaOferta.save();

    const nuevaPublicacion = new PublicacionOfertas({
      ofertaLaboral: nuevaOferta._id,
      perfil: perfil._id
    });
    await nuevaPublicacion.save();

    res.json({ message: 'Oferta laboral creada exitosamente', nuevaOferta });
  } catch (error) {
    console.error('Error creando/actualizando oferta laboral:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
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
    /*
        // Subir CV a Firebase Storage
        const nombreArchivo = `cvs/${uuidv4()}_${req.file.originalname}`;
        const file = bucket.file(nombreArchivo);
    
        await file.save(req.file.buffer, {
          metadata: {
            contentType: req.file.mimetype,
          },
        });
    
        const urlCV = `https://storage.googleapis.com/${bucket.name}/${nombreArchivo}`;
    */

    // Crear registro en colección Postulacion
    const nuevaPostulacion = new Postulacion({
      ofertaLaboral: oferta._id,
      perfil: perfil._id,
      correo,
      numero,
      cv: req.file.originalname,
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
  updateAptoPostulacion // nueva función
};
