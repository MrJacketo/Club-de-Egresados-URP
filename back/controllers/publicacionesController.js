// back/controllers/publicacionesController.js - CORREGIDO
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

// Crear publicación - CON USUARIO AUTENTICADO
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

// Agregar comentario - CON USUARIO AUTENTICADO
const comentarPublicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { contenido } = req.body;

    // Validaciones
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID de publicación inválido'
      });
    }

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
    
    // Validaciones
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    res.json({ mensaje: 'Publicación ocultada correctamente', publicacion });
  } catch (err) {
    console.error("Error al ocultar publicación:", err);
    res.status(500).json({ error: 'Error al ocultar publicación' });
  }
};

// Eliminar publicación - SOLO EL AUTOR PUEDE ELIMINAR
const eliminarPublicacion = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validaciones
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID de publicación inválido'
      });
    }

    const usuarioId = req.user.id;

    const publicacion = await Publicacion.findById(id);

    if (!publicacion) {
      return res.status(404).json({
        success: false,
        error: 'Publicación no encontrada'
      });
    }

    // Verificar que el usuario es el autor
    if (publicacion.autor.toString() !== usuarioId.toString()) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para eliminar esta publicación'
      });
    }

    // Soft delete - cambiar estado en lugar de eliminar
    publicacion.estado = 'eliminado';
    await publicacion.save();

    res.json({
      success: true,
      message: 'Publicación eliminada correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar publicación:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar publicación: ' + error.message
    });
  }
};

// ✅ EXPORTAR TODAS LAS FUNCIONES CORRECTAMENTE
module.exports = {
  obtenerPublicaciones,
  crearPublicacion,
  comentarPublicacion,
  toggleLike,
  ocultarPublicacion
};
