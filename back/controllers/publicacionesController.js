const Publicacion = require('../models/Publicacion');
const path = require('path');
const fs = require('fs');
// Obtener todas las publicaciones visibles
const obtenerPublicaciones = async (req, res) => {
  try {
    const publicaciones = await Publicacion.find({ oculto: false }).sort({ fechaCreacion: -1 });
    res.json(publicaciones);
  } catch (err) {
    console.error("Error al obtener publicaciones:", err);
    res.status(500).json({ error: 'Error al obtener publicaciones' });
  }
};

// Crear una nueva publicación
const crearPublicacion = async (req, res) => {
  try {
    const { contenido, autor } = req.body;

    // Base del objeto
    const nuevaPublicacion = new Publicacion({
      autor: autor || "Anónimo",
      contenido,
      fechaCreacion: new Date(),
      oculto: false,
      comentarios: [],
      likesCount: 0,
      medios: []
    });

    // Si se subió un archivo multimedia
    if (req.file) {
      const tipo = req.file.mimetype.startsWith("video") ? "video" : "imagen";
      const url = `/uploads/${req.file.filename}`; // Ruta accesible desde el front

      nuevaPublicacion.medios.push({ tipo, url });
    }

    const guardada = await nuevaPublicacion.save();
    res.status(201).json(guardada);
  } catch (err) {
    console.error("Error al crear publicación:", err);
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
    console.error("Error al comentar publicación:", err);
    res.status(500).json({ error: 'Error al comentar la publicación' });
  }
};

const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { accion } = req.body; // "like" o "unlike"

    const publicacion = await Publicacion.findById(id);
    if (!publicacion) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    if (accion === "like") {
      publicacion.likesCount += 1;
    } else if (accion === "unlike" && publicacion.likesCount > 0) {
      publicacion.likesCount -= 1;
    }

    const actualizada = await publicacion.save();
    res.json(actualizada);
  } catch (err) {
    console.error("Error al actualizar likes:", err);
    res.status(500).json({ error: 'Error al actualizar likes' });
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
    console.error("Error al ocultar publicación:", err);
    res.status(500).json({ error: 'Error al ocultar publicación' });
  }
};

module.exports = {
  obtenerPublicaciones,
  crearPublicacion,
  comentarPublicacion,
  toggleLike,
  ocultarPublicacion
};
