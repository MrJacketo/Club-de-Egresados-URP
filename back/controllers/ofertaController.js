const OfertaLaboral = require("../models/OfertaLaboral")
const User = require("../models/User")
const { AREAS_LABORALES, TIPOS_CONTRATO, MODALIDAD, REQUISITOS, ESTADO } = require('../enums/OfertaLaboral.enum');
// Crear o actualizar una oferta laboral
const createOrUpdateOferta = async (req, res) => {
  const { id } = req.params;  // ID de la oferta laboral a actualizar, si existe
  const { ofertaData, uid } = req.body;  // Los datos de la oferta laboral recibidos en el cuerpo de la solicitud

  try {
    // Verificar si la oferta laboral ya existe
    let oferta = id ? await OfertaLaboral.findById(id) : null;

    if (oferta) {
      // Si existe, actualizar la oferta
      Object.assign(oferta, ofertaData);
      oferta.updatedAt = Date.now();  // Actualizar la fecha de actualización
      await oferta.save();
      return res.json({ message: 'Oferta laboral actualizada exitosamente', oferta });
    }

    // Si no existe, crear una nueva oferta
    const perfil = await User.findOne({ firebaseUid: uid });
    if (!perfil) {
      return res.status(404).json({ error: 'Perfil de egresado no encontrado' });
    }
    oferta = new OfertaLaboral(ofertaData);
    await oferta.save();
    perfil.ofertasPublicadas.push({ oferta: oferta._id });
    await perfil.save();
    res.json({ message: 'Oferta laboral creada exitosamente', oferta });
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
    const ofertas = await OfertaLaboral.find().select("-postulantes");;  // Obtener todas las ofertas laborales
    res.json(ofertas);  // Devolver las ofertas
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
  const { id } = req.params;
  const { correo, numero, uid } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'Se requiere el archivo PDF del CV.' });
  }

  try {
    // Ejecutar ambas consultas en paralelo
    const [oferta, perfilDoc] = await Promise.all([
      OfertaLaboral.findById(id),
      User.findOne({ firebaseUid: uid }),
    ]);

    if (!oferta) {
      return res.status(404).json({ error: 'Oferta no encontrada' });
    }
    if (!perfilDoc) {
      return res.status(404).json({ error: 'Perfil de egresado no encontrado' });
    }

    // Verificar si ya postuló
    const yaPostulo = oferta.postulantes.some(
      (post) => post.perfil.toString() === perfilDoc._id.toString()
    );
    if (yaPostulo) {
      return res.status(400).json({ error: 'Ya has postulado a esta oferta' });
    }

    // Crear nuevo postulante
    const nuevoPostulante = {
      perfil: perfilDoc._id,
      correo,
      numero,
      cv: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        nombreArchivo: req.file.originalname,
      },
    };

    // Actualizar ambos documentos
    oferta.postulantes.push(nuevoPostulante);
    perfilDoc.ofertasPostuladas.push({ oferta: oferta._id });

    // Guardar ambos en paralelo
    await Promise.all([oferta.save(), perfilDoc.save()]);

    res.json({ message: 'Postulación realizada con éxito' });
  } catch (error) {
    console.error('Error al postular a la oferta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const verificarPostulacion = async (req, res) => {
  const { uid } = req.params;
  try {
    // Primero, buscar el perfil del usuario por uid
    const perfil = await User.findOne({ firebaseUid: uid });
    if (!perfil) return res.status(404).json({ error: 'Perfil no encontrado' });

    // Buscar ofertas donde postulantes contengan este perfil
    const ofertasPostuladas = await OfertaLaboral.find({
      'postulantes.perfil': perfil._id
    }).select('_id');

    const ids = ofertasPostuladas.map((oferta) => oferta._id);
    res.json({ ofertasPostuladas: ids });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

// controllers/oferta.controller.js

const getPostulantesDeOferta = async (req, res) => {
  try {
    const { idOferta } = req.params;

    const oferta = await OfertaLaboral.findById(idOferta);
    if (!oferta) {
      return res.status(404).json({ message: "Oferta no encontrada." });
    }

    const postulantes = oferta.postulantes.map((postulante) => ({
      _id: postulante._id,
      nombreCompleto: postulante.perfil?.name || "Nombre no registrado",
      correo: postulante.correo,
      numero: postulante.numero,
      cv: {
        nombreArchivo: postulante.cv?.nombreArchivo || null,
      },
    }));

    return res.json(postulantes);
  } catch (error) {
    console.error("Error al obtener postulantes:", error);
    return res.status(500).json({ message: "Error interno al obtener postulantes." });
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
  getPostulantesDeOferta
};
