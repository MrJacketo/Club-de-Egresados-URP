// back/controllers/publicacionesController.js - CORREGIDO
const Publicacion = require('../models/Publicacion');
const User = require('../models/User');
const mongoose = require('mongoose'); // ✅ Añadir esta importación

// Función auxiliar para validar ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Obtener todas las publicaciones
const obtenerPublicaciones = async (req, res) => {
  try {
    console.log('🔍 Obteniendo publicaciones...');
    
    const publicaciones = await Publicacion.find({ 
      oculto: false, 
      estado: { $in: ['activo', 'aprobado'] }, // Incluir tanto activas como aprobadas
      autor: { $exists: true, $ne: null }
    })
    .populate({
      path: 'autor',
      select: 'name email profilePicture',
      match: { _id: { $exists: true } }
    })
    .populate({
      path: 'comentarios.autor',
      select: 'name email profilePicture',
      match: { _id: { $exists: true } }
    })
    .populate({
      path: 'likes',
      select: 'name email profilePicture',
      match: { _id: { $exists: true } }
    })
    .sort({ createdAt: -1 });

    // Filtrar publicaciones con autor nulo o eliminado
    const publicacionesFiltradas = publicaciones.filter(pub => 
      pub.autor && pub.autor._id && pub.autor.name
    );

    console.log(`✅ ${publicacionesFiltradas.length} publicaciones válidas encontradas`);
    
    res.json({
      success: true,
      publicaciones: publicacionesFiltradas,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: publicacionesFiltradas.length,
        itemsPerPage: publicacionesFiltradas.length
      }
    });
  } catch (error) {
    console.error('Error al obtener publicaciones:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener publicaciones: ' + error.message
    });
  }
};

// Crear publicación - CON USUARIO AUTENTICADO
const crearPublicacion = async (req, res) => {
  try {
    const { contenido, titulo, categoria, etiquetas, imagen, video } = req.body;
    
    // Verificar que el usuario está autenticado
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    const usuarioId = req.user.id;

    // Verificar que el usuario existe
    const usuarioExiste = await User.findById(usuarioId);
    if (!usuarioExiste) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    console.log('👤 Usuario autenticado creando publicación:', usuarioId);
    
    if (!contenido || contenido.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'El contenido es obligatorio'
      });
    }

    const nuevaPublicacion = new Publicacion({
      autor: usuarioId,
      contenido: contenido.trim(),
      titulo: titulo || '',
      categoria: categoria || 'General',
      etiquetas: etiquetas || [],
      imagen: imagen || null,
      video: video || null
    });

    const publicacionGuardada = await nuevaPublicacion.save();
    
    // Poblar con validación
    await publicacionGuardada.populate({
      path: 'autor',
      select: 'name email profilePicture',
      match: { _id: { $exists: true } }
    });
    
    console.log('✅ Publicación creada exitosamente');
    
    res.status(201).json({
      success: true,
      message: 'Publicación creada exitosamente',
      publicacion: publicacionGuardada
    });
  } catch (error) {
    console.error('Error al crear publicación:', error);
    res.status(400).json({
      success: false,
      error: 'Error al crear publicación: ' + error.message
    });
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

    const usuarioId = req.user.id;

    if (!contenido || contenido.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'El contenido del comentario es obligatorio'
      });
    }

    const publicacion = await Publicacion.findById(id);
    if (!publicacion) {
      return res.status(404).json({
        success: false,
        error: 'Publicación no encontrada'
      });
    }

    // Verificar que el usuario existe
    const usuarioExiste = await User.findById(usuarioId);
    if (!usuarioExiste) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    await publicacion.agregarComentario(usuarioId, contenido);
    
    // Recargar con validaciones
    const publicacionActualizada = await Publicacion.findById(id)
      .populate({
        path: 'autor',
        select: 'name email profilePicture',
        match: { _id: { $exists: true } }
      })
      .populate({
        path: 'comentarios.autor',
        select: 'name email profilePicture',
        match: { _id: { $exists: true } }
      });

    // Filtrar comentarios con autores válidos
    const comentariosValidos = publicacionActualizada.comentarios.filter(
      comentario => comentario.autor && comentario.autor.name
    );

    res.json({
      success: true,
      message: 'Comentario agregado exitosamente',
      comentarios: comentariosValidos
    });
  } catch (error) {
    console.error('Error al comentar publicación:', error);
    res.status(500).json({
      success: false,
      error: 'Error al comentar la publicación: ' + error.message
    });
  }
};

// Dar like - CON USUARIO AUTENTICADO
const darLikePublicacion = async (req, res) => {
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

    // Verificar que el usuario existe
    const usuarioExiste = await User.findById(usuarioId);
    if (!usuarioExiste) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    // Usar el método del modelo para agregar like
    await publicacion.agregarLike(usuarioId);
    
    // Recargar la publicación con los datos poblados
    const publicacionActualizada = await Publicacion.findById(id)
      .populate({
        path: 'autor',
        select: 'name email profilePicture',
        match: { _id: { $exists: true } }
      })
      .populate({
        path: 'likes',
        select: 'name email profilePicture',
        match: { _id: { $exists: true } }
      });

    // Filtrar likes válidos
    const likesValidos = publicacionActualizada.likes.filter(
      like => like && like.name
    );

    res.json({
      success: true,
      message: 'Like agregado exitosamente',
      likes: likesValidos.length,
      usuariosQueDieronLike: likesValidos
    });
  } catch (error) {
    console.error('Error al dar like:', error);
    res.status(500).json({
      success: false,
      error: 'Error al dar like a la publicación: ' + error.message
    });
  }
};

// Quitar like - CON USUARIO AUTENTICADO
const quitarLikePublicacion = async (req, res) => {
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

    // Usar el método del modelo para quitar like
    await publicacion.quitarLike(usuarioId);
    
    // Recargar la publicación con los datos poblados
    const publicacionActualizada = await Publicacion.findById(id)
      .populate({
        path: 'autor',
        select: 'name email profilePicture',
        match: { _id: { $exists: true } }
      })
      .populate({
        path: 'likes',
        select: 'name email profilePicture',
        match: { _id: { $exists: true } }
      });

    // Filtrar likes válidos
    const likesValidos = publicacionActualizada.likes.filter(
      like => like && like.name
    );

    res.json({
      success: true,
      message: 'Like quitado exitosamente',
      likes: likesValidos.length,
      usuariosQueDieronLike: likesValidos
    });
  } catch (error) {
    console.error('Error al quitar like:', error);
    res.status(500).json({
      success: false,
      error: 'Error al quitar like de la publicación: ' + error.message
    });
  }
};

// Obtener publicación por ID
const obtenerPublicacionPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID de publicación inválido'
      });
    }

    const publicacion = await Publicacion.findById(id)
      .populate({
        path: 'autor',
        select: 'name email profilePicture',
        match: { _id: { $exists: true } }
      })
      .populate({
        path: 'comentarios.autor',
        select: 'name email profilePicture',
        match: { _id: { $exists: true } }
      })
      .populate({
        path: 'likes',
        select: 'name email profilePicture',
        match: { _id: { $exists: true } }
      });

    if (!publicacion) {
      return res.status(404).json({
        success: false,
        error: 'Publicación no encontrada'
      });
    }

    // Verificar que el autor existe
    if (!publicacion.autor || !publicacion.autor.name) {
      return res.status(404).json({
        success: false,
        error: 'Autor de la publicación no encontrado'
      });
    }

    // Incrementar vistas
    await publicacion.incrementarVistas();

    res.json({
      success: true,
      publicacion: publicacion
    });
  } catch (error) {
    console.error('Error al obtener publicación:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener la publicación: ' + error.message
    });
  }
};

// Obtener publicaciones populares
const obtenerPublicacionesPopulares = async (req, res) => {
  try {
    const publicaciones = await Publicacion.find({ 
      oculto: false, 
      estado: 'activo',
      autor: { $exists: true, $ne: null }
    })
      .sort({ likes: -1, vistas: -1 })
      .limit(5)
      .populate({
        path: 'autor',
        select: 'name email profilePicture',
        match: { _id: { $exists: true } }
      })
      .populate({
        path: 'comentarios.autor',
        select: 'name email profilePicture',
        match: { _id: { $exists: true } }
      })
      .populate({
        path: 'likes',
        select: 'name email profilePicture',
        match: { _id: { $exists: true } }
      });

    // Filtrar publicaciones con autor válido
    const publicacionesValidas = publicaciones.filter(pub => 
      pub.autor && pub.autor.name
    );

    res.json({
      success: true,
      publicaciones: publicacionesValidas
    });
  } catch (error) {
    console.error('Error al obtener publicaciones populares:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener publicaciones populares: ' + error.message
    });
  }
};

// Ocultar publicación - SOLO EL AUTOR PUEDE OCULTAR
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

    // Verificar que el usuario es el autor O es moderador/admin
    const esAutor = publicacion.autor.toString() === usuarioId.toString();
    const esModerador = req.user.rol === 'moderador' || req.user.rol === 'admin' || req.user.rol === 'inspector_laboral';
    
    if (!esAutor && !esModerador) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para ocultar esta publicación'
      });
    }

    publicacion.oculto = true;
    await publicacion.save();

    res.json({
      success: true,
      message: 'Publicación ocultada correctamente'
    });
  } catch (error) {
    console.error('Error al ocultar publicación:', error);
    res.status(500).json({
      success: false,
      error: 'Error al ocultar publicación: ' + error.message
    });
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

    // Verificar que el usuario es el autor O es moderador/admin
    const esAutor = publicacion.autor.toString() === usuarioId.toString();
    const esModerador = req.user.rol === 'moderador' || req.user.rol === 'admin' || req.user.rol === 'inspector_laboral';
    
    if (!esAutor && !esModerador) {
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

// Aprobar publicación - SOLO MODERADORES/ADMINS
const aprobarPublicacion = async (req, res) => {
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

    // Verificar que el usuario es moderador/admin
    const esModerador = req.user.rol === 'moderador' || req.user.rol === 'admin' || req.user.rol === 'inspector_laboral';
    
    if (!esModerador) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos de moderador para aprobar publicaciones'
      });
    }

    const publicacion = await Publicacion.findById(id);

    if (!publicacion) {
      return res.status(404).json({
        success: false,
        error: 'Publicación no encontrada'
      });
    }

    // Marcar como aprobada y activa
    publicacion.estado = 'aprobado';
    publicacion.moderadoPor = req.user.id;
    publicacion.fechaModeracion = new Date();
    
    await publicacion.save();

    res.json({
      success: true,
      message: 'Publicación aprobada correctamente',
      data: publicacion
    });
  } catch (error) {
    console.error('Error al aprobar publicación:', error);
    res.status(500).json({
      success: false,
      error: 'Error al aprobar publicación: ' + error.message
    });
  }
};

// ✅ EXPORTAR TODAS LAS FUNCIONES CORRECTAMENTE
module.exports = {
  obtenerPublicaciones,
  crearPublicacion,
  comentarPublicacion,
  darLikePublicacion, // ✅ Ahora está definida
  quitarLikePublicacion, // ✅ Ahora está definida
  obtenerPublicacionPorId,
  obtenerPublicacionesPopulares,
  ocultarPublicacion,
  aprobarPublicacion,
  eliminarPublicacion
};