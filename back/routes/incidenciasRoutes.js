const express = require("express");
const router = express.Router();
const verifyJWTToken = require("../middleware/verifyJWTToken");
const { 
  verificarInspectorLaboral, 
  verificarPermisoLectura, 
  verificarPermisoEscritura 
} = require("../middleware/verificarInspectorLaboral");
const incidenciasController = require("../controllers/incidenciasController");

// Middleware de autenticación opcional para algunas rutas
const authOpcional = (req, res, next) => {
  // Intentar verificar el token, pero no fallar si no está presente
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    // No hay token, continuar sin usuario autenticado
    req.user = null;
    return next();
  }
  
  // Si hay token, verificarlo
  verifyJWTToken(req, res, (err) => {
    if (err) {
      // Si el token es inválido, continuar sin usuario autenticado
      req.user = null;
    }
    next();
  });
};

// RUTAS PÚBLICAS (no requieren autenticación)

// GET /api/incidencias/estadisticas - Estadísticas básicas (público)
router.get("/estadisticas", incidenciasController.getEstadisticas);

// RUTAS CON AUTENTICACIÓN OPCIONAL

// GET /api/incidencias - Obtener todas las incidencias (con autenticación opcional)
router.get("/", authOpcional, verificarPermisoLectura, incidenciasController.getIncidencias);

// GET /api/incidencias/:id - Obtener una incidencia específica (con autenticación opcional)
router.get("/:id", authOpcional, verificarPermisoLectura, incidenciasController.getIncidenciaPorId);

// RUTAS QUE REQUIEREN AUTENTICACIÓN

// POST /api/incidencias - Crear nueva incidencia (requiere autenticación)
router.post("/", verifyJWTToken, verificarPermisoEscritura, incidenciasController.crearIncidencia);

// PUT /api/incidencias/:id - Actualizar incidencia (solo inspectores, moderadores, admins)
router.put("/:id", verifyJWTToken, verificarInspectorLaboral, incidenciasController.actualizarIncidencia);

// PUT /api/incidencias/:id/ocultar - Ocultar/Mostrar incidencia (solo inspectores, moderadores, admins)
router.put("/:id/ocultar", verifyJWTToken, verificarInspectorLaboral, incidenciasController.toggleOcultarIncidencia);

// DELETE /api/incidencias/:id - Eliminar incidencia (solo inspectores, moderadores, admins)
router.delete("/:id", verifyJWTToken, verificarInspectorLaboral, incidenciasController.eliminarIncidencia);

// RUTAS ADICIONALES ESPECÍFICAS

// GET /api/incidencias/buscar/:termino - Búsqueda por texto
router.get("/buscar/:termino", authOpcional, verificarPermisoLectura, async (req, res) => {
  try {
    const { termino } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Usar el método estático del modelo para búsqueda de texto
    const IncidenciaLaboral = require('../models/IncidenciaLaboral');
    
    const resultados = await IncidenciaLaboral.buscarTexto(termino)
      .populate('oferta_relacionada', 'cargo empresa')
      .populate('inspector_asignado', 'name email')
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    
    const total = await IncidenciaLaboral.countDocuments({
      $text: { $search: termino },
      eliminado: false
    });
    
    res.json({
      success: true,
      data: resultados,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({
      success: false,
      message: 'Error en la búsqueda',
      error: error.message
    });
  }
});

// GET /api/incidencias/por-estado/:estado - Obtener incidencias por estado
router.get("/por-estado/:estado", verifyJWTToken, verificarInspectorLaboral, async (req, res) => {
  try {
    const { estado } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const estadosValidos = ['En revisión', 'Revisado'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido. Estados válidos: "En revisión", "Revisado"'
      });
    }
    
    const IncidenciaLaboral = require('../models/IncidenciaLaboral');
    
    const incidencias = await IncidenciaLaboral.findPorEstado(estado)
      .populate('oferta_relacionada', 'cargo empresa')
      .populate('inspector_asignado', 'name email')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    
    const total = await IncidenciaLaboral.countDocuments({ 
      estado, 
      eliminado: false 
    });
    
    res.json({
      success: true,
      data: incidencias,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Error al obtener incidencias por estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener incidencias por estado',
      error: error.message
    });
  }
});

// PUT /api/incidencias/:id/asignar-inspector - Asignar inspector a una incidencia
router.put("/:id/asignar-inspector", verifyJWTToken, verificarInspectorLaboral, async (req, res) => {
  try {
    const { id } = req.params;
    const { inspector_id } = req.body;
    
    const IncidenciaLaboral = require('../models/IncidenciaLaboral');
    const User = require('../models/User');
    const mongoose = require('mongoose');
    
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de incidencia inválido'
      });
    }
    
    if (!mongoose.isValidObjectId(inspector_id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de inspector inválido'
      });
    }
    
    // Verificar que el inspector existe y tiene el rol apropiado
    const inspector = await User.findById(inspector_id);
    if (!inspector || !['inspector_laboral', 'moderador', 'admin'].includes(inspector.rol)) {
      return res.status(400).json({
        success: false,
        message: 'El usuario no es un inspector válido'
      });
    }
    
    const incidencia = await IncidenciaLaboral.findByIdAndUpdate(
      id,
      { 
        inspector_asignado: inspector_id,
        fechaActualizacion: new Date()
      },
      { new: true, runValidators: true }
    ).populate('inspector_asignado', 'name email rol');
    
    if (!incidencia) {
      return res.status(404).json({
        success: false,
        message: 'Incidencia no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Inspector asignado exitosamente',
      data: {
        inspector_asignado: incidencia.inspector_asignado,
        fechaActualizacion: incidencia.fechaActualizacion
      }
    });
    
  } catch (error) {
    console.error('Error al asignar inspector:', error);
    res.status(500).json({
      success: false,
      message: 'Error al asignar inspector',
      error: error.message
    });
  }
});

// GET /api/incidencias/mis-asignadas - Obtener incidencias asignadas al usuario actual
router.get("/mis-asignadas", verifyJWTToken, verificarInspectorLaboral, async (req, res) => {
  try {
    const { page = 1, limit = 10, estado } = req.query;
    const userId = req.user.id;
    
    const filtros = { 
      inspector_asignado: userId,
      eliminado: false 
    };
    
    if (estado && estado !== 'Todos') {
      filtros.estado = estado;
    }
    
    const IncidenciaLaboral = require('../models/IncidenciaLaboral');
    
    const incidencias = await IncidenciaLaboral.find(filtros)
      .populate('oferta_relacionada', 'cargo empresa')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    
    const total = await IncidenciaLaboral.countDocuments(filtros);
    
    res.json({
      success: true,
      data: incidencias,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Error al obtener incidencias asignadas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener incidencias asignadas',
      error: error.message
    });
  }
});

module.exports = router;