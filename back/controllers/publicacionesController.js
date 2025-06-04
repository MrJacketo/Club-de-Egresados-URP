const Publicacion = require('../models/Publicacion');

// Obtener todas las publicaciones visibles
const obtenerPublicaciones = async (req, res) => {
  try {
    const publicaciones = await Publicacion.find({ oculto: false }).sort({ fechaCreacion: -1 });
    res.json(publicaciones);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener publicaciones' });
  }
};

// Crear una nueva publicación
const crearPublicacion = async (req, res) => {
  try {
    const nuevaPublicacion = new Publicacion({
      autor: req.user.firebaseUid,
      contenido: req.body.contenido,
      fechaCreacion: new Date(),
      oculto: false,
      comentarios: []
    });

    const guardada = await nuevaPublicacion.save();
    res.status(201).json(guardada);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear publicación' });
  }
};

// Comentar una publicación existente
const comentarPublicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { autor, contenido } = req.body;

    const publicacion = await Publicacion.findById(id);
    if (!publicacion || publicacion.oculto) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    publicacion.comentarios.push({
      autor,
      contenido,
      fechaCreacion: new Date()
    });

    const actualizada = await publicacion.save();
    res.json(actualizada);
  } catch (err) {
    res.status(500).json({ error: 'Error al comentar la publicación' });
  }
};

// Ocultar publicación (en lugar de eliminar)
const ocultarPublicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const publicacion = await Publicacion.findByIdAndUpdate(id, { oculto: true }, { new: true });

    if (!publicacion) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    res.json({ mensaje: 'Publicación ocultada correctamente', publicacion });
  } catch (err) {
    res.status(500).json({ error: 'Error al ocultar publicación' });
  }
};

module.exports = {
  obtenerPublicaciones,
  crearPublicacion,
  comentarPublicacion,
  ocultarPublicacion
};
