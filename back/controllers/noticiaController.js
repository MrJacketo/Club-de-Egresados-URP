const Noticia = require('../models/Noticia');

// Crear noticia
const crearNoticia = async (req, res) => {
    const { titulo, contenido, resumen, autor, categoria, imagen, destacado } = req.body;

    if (!titulo || !contenido) {
        return res.status(400).json({ error: 'Título y contenido son obligatorios' });
    }

    try {
        const nuevaNoticia = new Noticia({
            titulo,
            contenido,
            resumen,
            autor,
            categoria,
            imagen,
            destacado: destacado || false
        });

        const noticiaGuardada = await nuevaNoticia.save();
        res.status(201).json({ message: 'Noticia creada exitosamente', noticia: noticiaGuardada });
    } catch (error) {
        console.error('Error al crear noticia:', error);
        res.status(500).json({ error: 'Error al crear noticia' });
    }
};

// Obtener todas las noticias
const obtenerNoticias = async (req, res) => {
    try {
        const noticias = await Noticia.find({ activo: true })
            .sort({ createdAt: -1 });
        
        res.json({ noticias });
    } catch (error) {
        console.error('Error al obtener noticias:', error);
        res.status(500).json({ error: 'Error al obtener noticias' });
    }
};

// Obtener noticias destacadas
const obtenerNoticiasDestacadas = async (req, res) => {
    try {
        const noticias = await Noticia.find({ activo: true, destacado: true })
            .sort({ createdAt: -1 });
        
        res.json({ noticias });
    } catch (error) {
        console.error('Error al obtener noticias destacadas:', error);
        res.status(500).json({ error: 'Error al obtener noticias destacadas' });
    }
};

// Obtener noticia por ID
const obtenerNoticiaPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const noticia = await Noticia.findById(id);

        if (!noticia) {
            return res.status(404).json({ error: 'Noticia no encontrada' });
        }

        res.json({ noticia });
    } catch (error) {
        console.error('Error al obtener noticia:', error);
        res.status(500).json({ error: 'Error al obtener noticia' });
    }
};

// Actualizar noticia
const actualizarNoticia = async (req, res) => {
    const { id } = req.params;
    const datosActualizacion = req.body;

    try {
        const noticiaActualizada = await Noticia.findByIdAndUpdate(
            id,
            datosActualizacion,
            { new: true }
        );

        if (!noticiaActualizada) {
            return res.status(404).json({ error: 'Noticia no encontrada' });
        }

        res.json({ message: 'Noticia actualizada exitosamente', noticia: noticiaActualizada });
    } catch (error) {
        console.error('Error al actualizar noticia:', error);
        res.status(500).json({ error: 'Error al actualizar noticia' });
    }
};

// Eliminar noticia (soft delete)
const eliminarNoticia = async (req, res) => {
    const { id } = req.params;

    try {
        const noticiaEliminada = await Noticia.findByIdAndUpdate(
            id,
            { activo: false },
            { new: true }
        );

        if (!noticiaEliminada) {
            return res.status(404).json({ error: 'Noticia no encontrada' });
        }

        res.json({ message: 'Noticia eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar noticia:', error);
        res.status(500).json({ error: 'Error al eliminar noticia' });
    }
};

module.exports = {
    crearNoticia,
    obtenerNoticias,
    obtenerNoticiasDestacadas,
    obtenerNoticiaPorId,
    actualizarNoticia,
    eliminarNoticia,
};