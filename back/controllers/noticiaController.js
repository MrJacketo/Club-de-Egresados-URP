const Noticia = require('../models/Noticia');

// ===== FUNCIONES PÚBLICAS =====

// Obtener todas las noticias (público)
const obtenerNoticias = async (req, res) => {
    try {
        const { page = 1, limit = 10, categoria, destacado } = req.query;
        const query = { activo: true };

        // Filtrar por categoría si se proporciona
        if (categoria && categoria !== 'todas') {
            query.categoria = categoria;
        }

        // Filtrar por destacado si se proporciona
        if (destacado === 'true') {
            query.destacado = true;
        }

        const noticias = await Noticia.find(query)
            .populate('creadoPor', 'name email')
            .sort({ fechaPublicacion: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await Noticia.countDocuments(query);

        res.json({
            success: true,
            noticias,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Error al obtener noticias:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al obtener noticias' 
        });
    }
};

// Obtener noticia por ID (incrementa vistas)
const obtenerNoticiaPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const noticia = await Noticia.findOne({ _id: id, activo: true })
            .populate('creadoPor', 'name email')
            .populate('modificadoPor', 'name email');

        if (!noticia) {
            return res.status(404).json({ 
                success: false,
                error: 'Noticia no encontrada' 
            });
        }

        // Incrementar vistas
        await noticia.incrementarVistas();

        res.json({ 
            success: true,
            noticia 
        });
    } catch (error) {
        console.error('Error al obtener noticia:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al obtener noticia' 
        });
    }
};

// ===== FUNCIONES DE ADMINISTRADOR =====

// Obtener todas las noticias (admin) - incluye inactivas
const obtenerTodasNoticiasAdmin = async (req, res) => {
    try {
        const { page = 1, limit = 10, categoria, estado, destacado, ordenar = 'fechaPublicacion' } = req.query;
        const query = {};

        // Filtros
        if (categoria && categoria !== 'todas') {
            query.categoria = categoria;
        }

        if (estado === 'activas') {
            query.activo = true;
        } else if (estado === 'inactivas') {
            query.activo = false;
        }

        if (destacado === 'true') {
            query.destacado = true;
        } else if (destacado === 'false') {
            query.destacado = false;
        }

        // Ordenamiento
        let sortBy = {};
        switch (ordenar) {
            case 'fechaPublicacion':
                sortBy.fechaPublicacion = -1;
                break;
            case 'vistas':
                sortBy.vistas = -1;
                break;
            case 'titulo':
                sortBy.titulo = 1;
                break;
            default:
                sortBy.createdAt = -1;
        }

        const noticias = await Noticia.find(query)
            .populate('creadoPor', 'name email')
            .populate('modificadoPor', 'name email')
            .sort(sortBy)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await Noticia.countDocuments(query);

        res.json({
            success: true,
            noticias,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        console.error('Error al obtener noticias (admin):', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al obtener noticias' 
        });
    }
};

// Crear noticia
const crearNoticia = async (req, res) => {
    const { titulo, contenido, resumen, autor, categoria, imagen, destacado, fechaPublicacion } = req.body;

    try {
        const nuevaNoticia = new Noticia({
            titulo: titulo.trim(),
            contenido: contenido.trim(),
            resumen: resumen ? resumen.trim() : '',
            autor: autor ? autor.trim() : req.user.name,
            categoria,
            imagen: imagen || '',
            destacado: destacado || false,
            fechaPublicacion: fechaPublicacion ? new Date(fechaPublicacion) : new Date(),
            creadoPor: req.user._id
        });

        const noticiaGuardada = await nuevaNoticia.save();
        
        // Poblar los datos del usuario para la respuesta
        await noticiaGuardada.populate('creadoPor', 'name email');

        res.status(201).json({ 
            success: true,
            message: 'Noticia creada exitosamente', 
            noticia: noticiaGuardada 
        });
    } catch (error) {
        console.error('Error al crear noticia:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al crear noticia',
            detalles: error.message 
        });
    }
};

// Actualizar noticia (por campos)
const actualizarNoticia = async (req, res) => {
    const { id } = req.params;
    const datosActualizacion = { ...req.body };

    try {
        // Eliminar campos que no se deben actualizar directamente
        delete datosActualizacion.creadoPor;
        delete datosActualizacion.createdAt;
        delete datosActualizacion.vistas;

        // Agregar información de modificación
        datosActualizacion.modificadoPor = req.user._id;

        // Limpiar strings si existen
        if (datosActualizacion.titulo) {
            datosActualizacion.titulo = datosActualizacion.titulo.trim();
        }
        if (datosActualizacion.contenido) {
            datosActualizacion.contenido = datosActualizacion.contenido.trim();
        }
        if (datosActualizacion.resumen) {
            datosActualizacion.resumen = datosActualizacion.resumen.trim();
        }
        if (datosActualizacion.autor) {
            datosActualizacion.autor = datosActualizacion.autor.trim();
        }

        const noticiaActualizada = await Noticia.findByIdAndUpdate(
            id,
            datosActualizacion,
            { new: true, runValidators: true }
        ).populate('creadoPor', 'name email')
         .populate('modificadoPor', 'name email');

        if (!noticiaActualizada) {
            return res.status(404).json({ 
                success: false,
                error: 'Noticia no encontrada' 
            });
        }

        res.json({ 
            success: true,
            message: 'Noticia actualizada exitosamente', 
            noticia: noticiaActualizada 
        });
    } catch (error) {
        console.error('Error al actualizar noticia:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al actualizar noticia',
            detalles: error.message 
        });
    }
};

// Eliminar noticia (soft delete)
const eliminarNoticia = async (req, res) => {
    const { id } = req.params;

    try {
        const noticiaEliminada = await Noticia.findByIdAndUpdate(
            id,
            { 
                activo: false,
                modificadoPor: req.user._id
            },
            { new: true }
        );

        if (!noticiaEliminada) {
            return res.status(404).json({ 
                success: false,
                error: 'Noticia no encontrada' 
            });
        }

        res.json({ 
            success: true,
            message: 'Noticia eliminada exitosamente' 
        });
    } catch (error) {
        console.error('Error al eliminar noticia:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al eliminar noticia' 
        });
    }
};

// Cambiar estado destacado
const cambiarEstadoDestacado = async (req, res) => {
    const { id } = req.params;
    const { destacado } = req.body;

    try {
        const noticiaActualizada = await Noticia.findByIdAndUpdate(
            id,
            { 
                destacado,
                modificadoPor: req.user._id
            },
            { new: true }
        ).populate('creadoPor', 'name email')
         .populate('modificadoPor', 'name email');

        if (!noticiaActualizada) {
            return res.status(404).json({ 
                success: false,
                error: 'Noticia no encontrada' 
            });
        }

        res.json({ 
            success: true,
            message: `Noticia ${destacado ? 'marcada como destacada' : 'quitada de destacadas'} exitosamente`,
            noticia: noticiaActualizada 
        });
    } catch (error) {
        console.error('Error al cambiar estado destacado:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al cambiar estado destacado' 
        });
    }
};

// Obtener estadísticas
const obtenerEstadisticas = async (req, res) => {
    try {
        // Fecha hace 7 días
        const hace7Dias = new Date();
        hace7Dias.setDate(hace7Dias.getDate() - 7);

        // Ejecutar todas las consultas en paralelo
        const [
            totalNoticias,
            noticiasActivas,
            noticiasDestacadas,
            noticiasRecientes,
            noticiasPorCategoria,
            todasLasNoticias
        ] = await Promise.all([
            Noticia.countDocuments(),
            Noticia.countDocuments({ activo: true }),
            Noticia.countDocuments({ activo: true, destacado: true }),
            Noticia.countDocuments({ 
                activo: true, 
                createdAt: { $gte: hace7Dias } 
            }),
            Noticia.aggregate([
                { $match: { activo: true } },
                { $group: { _id: '$categoria', total: { $sum: 1 } } },
                { $sort: { total: -1 } }
            ]),
            Noticia.find({ activo: true }, 'contenido categoria')
        ]);

        // Calcular promedio de caracteres
        const totalCaracteres = todasLasNoticias.reduce((sum, noticia) => {
            return sum + (noticia.contenido ? noticia.contenido.length : 0);
        }, 0);
        const promedioCaracteres = noticiasActivas > 0 ? Math.round(totalCaracteres / noticiasActivas) : 0;

        // Formatear datos por categoría
        const datosPorCategoria = noticiasPorCategoria.map(item => ({
            categoria: item._id,
            total: item.total,
            porcentaje: Math.round((item.total / noticiasActivas) * 100)
        }));

        // Obtener noticia más vista
        const noticiaMasVista = await Noticia.findOne({ activo: true })
            .sort({ vistas: -1 })
            .select('titulo vistas')
            .limit(1);

        res.json({
            success: true,
            estadisticas: {
                resumen: {
                    totalNoticias,
                    noticiasActivas,
                    noticiasInactivas: totalNoticias - noticiasActivas,
                    noticiasDestacadas,
                    noticiasRecientes7Dias: noticiasRecientes,
                    promedioCaracteres
                },
                porCategoria: datosPorCategoria,
                noticiaMasVista: noticiaMasVista || null,
                fechaActualizacion: new Date()
            }
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al obtener estadísticas' 
        });
    }
};

module.exports = {
    // Funciones públicas
    obtenerNoticias,
    obtenerNoticiaPorId,
    
    // Funciones de administrador
    obtenerTodasNoticiasAdmin,
    crearNoticia,
    actualizarNoticia,
    eliminarNoticia,
    cambiarEstadoDestacado,
    obtenerEstadisticas
};