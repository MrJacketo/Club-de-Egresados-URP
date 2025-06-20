const express = require("express");
const router = express.Router();

// Importar controladores
const {
    obtenerNoticias,
    obtenerNoticiaPorId,
    obtenerTodasNoticiasAdmin,
    crearNoticia,
    actualizarNoticia,
    eliminarNoticia,
    cambiarEstadoDestacado,
    obtenerEstadisticas
} = require("../controllers/noticiaController");

// Importar middlewares
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
const { verifyAdminAccess } = require("../middleware/verifyAdmin");

// Importar validaciones
const {
    validarCrearNoticia,
    validarActualizarNoticia,
    validarCambiarDestacado
} = require("../middleware/noticiaValidations");

// ===== RUTAS PÚBLICAS =====

// Obtener todas las noticias activas (público)
router.get("/", obtenerNoticias);

// Obtener noticia por ID (público - incrementa vistas)
router.get("/:id", obtenerNoticiaPorId);

// ===== RUTAS DE ADMINISTRADOR =====

// Obtener todas las noticias para admin (incluye inactivas)
router.get("/admin/todas", verifyAdminAccess, obtenerTodasNoticiasAdmin);

// Obtener estadísticas
router.get("/admin/estadisticas", verifyAdminAccess, obtenerEstadisticas);

// Crear nueva noticia
router.post("/admin/crear", verifyAdminAccess, validarCrearNoticia, crearNoticia);

// Actualizar noticia
router.put("/admin/:id", verifyAdminAccess, validarActualizarNoticia, actualizarNoticia);

// Eliminar noticia (soft delete)
router.delete("/admin/:id", verifyAdminAccess, eliminarNoticia);

// Cambiar estado destacado
router.patch("/admin/:id/destacado", verifyAdminAccess, validarCambiarDestacado, cambiarEstadoDestacado);

// ===== RUTAS ADICIONALES ÚTILES =====

// Obtener solo noticias destacadas (público)
router.get("/publico/destacadas", async (req, res) => {
    try {
        const { limit = 5 } = req.query;
        const Noticia = require("../models/Noticia");
        
        const noticiasDestacadas = await Noticia.find({ activo: true, destacado: true })
            .populate('creadoPor', 'name')
            .sort({ fechaPublicacion: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            noticias: noticiasDestacadas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al obtener noticias destacadas'
        });
    }
});

// Obtener noticias por categoría (público)
router.get("/categoria/:categoria", async (req, res) => {
    try {
        const { categoria } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const Noticia = require("../models/Noticia");

        const noticias = await Noticia.find({ 
            activo: true, 
            categoria: categoria 
        })
        .populate('creadoPor', 'name')
        .sort({ fechaPublicacion: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

        const total = await Noticia.countDocuments({ activo: true, categoria: categoria });

        res.json({
            success: true,
            noticias,
            categoria,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al obtener noticias por categoría'
        });
    }
});

// Obtener categorías disponibles (público)
router.get("/publico/categorias", async (req, res) => {
    try {
        const Noticia = require("../models/Noticia");
        
        const categorias = await Noticia.aggregate([
            { $match: { activo: true } },
            { $group: { _id: '$categoria', total: { $sum: 1 } } },
            { $sort: { total: -1 } }
        ]);

        const categoriasFormateadas = categorias.map(cat => ({
            nombre: cat._id,
            total: cat.total
        }));

        res.json({
            success: true,
            categorias: categoriasFormateadas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al obtener categorías'
        });
    }
});

// Buscar noticias (público)
router.get("/publico/buscar", async (req, res) => {
    try {
        const { q, categoria, page = 1, limit = 10 } = req.query;
        
        if (!q || q.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Parámetro de búsqueda requerido'
            });
        }

        const Noticia = require("../models/Noticia");
        
        const query = {
            activo: true,
            $or: [
                { titulo: { $regex: q, $options: 'i' } },
                { contenido: { $regex: q, $options: 'i' } },
                { resumen: { $regex: q, $options: 'i' } }
            ]
        };

        if (categoria && categoria !== 'todas') {
            query.categoria = categoria;
        }

        const noticias = await Noticia.find(query)
            .populate('creadoPor', 'name')
            .sort({ fechaPublicacion: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Noticia.countDocuments(query);

        res.json({
            success: true,
            noticias,
            busqueda: q,
            categoria: categoria || 'todas',
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al buscar noticias'
        });
    }
});

module.exports = router;