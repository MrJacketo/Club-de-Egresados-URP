// Validaciones para crear noticia
const validarCrearNoticia = (req, res, next) => {
    const { titulo, contenido, categoria } = req.body;
    const errores = [];

    // Validar título
    if (!titulo || titulo.trim() === '') {
        errores.push('El título es obligatorio');
    } else if (titulo.length > 200) {
        errores.push('El título no puede exceder 200 caracteres');
    }

    // Validar contenido
    if (!contenido || contenido.trim() === '') {
        errores.push('El contenido es obligatorio');
    } else if (contenido.length < 50) {
        errores.push('El contenido debe tener al menos 50 caracteres');
    }

    // Validar categoría
    const categoriasValidas = ['Deportes', 'Tecnología', 'Política', 'Entretenimiento', 'Salud', 'Educación', 'Economía', 'Ciencia', 'Cultura', 'Otros'];
    if (!categoria || !categoriasValidas.includes(categoria)) {
        errores.push('La categoría es obligatoria y debe ser válida');
    }

    // Validar resumen si existe
    if (req.body.resumen && req.body.resumen.length > 500) {
        errores.push('El resumen no puede exceder 500 caracteres');
    }

    // Validar imagen URL si existe
    if (req.body.imagen) {
        const urlRegex = /^https?:\/\/.+/;
        if (!urlRegex.test(req.body.imagen)) {
            errores.push('La URL de la imagen debe ser válida');
        }
    }

    if (errores.length > 0) {
        return res.status(400).json({
            error: 'Errores de validación',
            detalles: errores
        });
    }

    next();
};

// Validaciones para actualizar noticia
const validarActualizarNoticia = (req, res, next) => {
    const { titulo, contenido, categoria, resumen, imagen } = req.body;
    const errores = [];

    // Solo validar campos que se están enviando
    if (titulo !== undefined) {
        if (titulo.trim() === '') {
            errores.push('El título no puede estar vacío');
        } else if (titulo.length > 200) {
            errores.push('El título no puede exceder 200 caracteres');
        }
    }

    if (contenido !== undefined) {
        if (contenido.trim() === '') {
            errores.push('El contenido no puede estar vacío');
        } else if (contenido.length < 50) {
            errores.push('El contenido debe tener al menos 50 caracteres');
        }
    }

    if (categoria !== undefined) {
        const categoriasValidas = ['Deportes', 'Tecnología', 'Política', 'Entretenimiento', 'Salud', 'Educación', 'Economía', 'Ciencia', 'Cultura', 'Otros'];
        if (!categoriasValidas.includes(categoria)) {
            errores.push('La categoría debe ser válida');
        }
    }

    if (resumen !== undefined && resumen.length > 500) {
        errores.push('El resumen no puede exceder 500 caracteres');
    }

    if (imagen !== undefined && imagen !== '') {
        const urlRegex = /^https?:\/\/.+/;
        if (!urlRegex.test(imagen)) {
            errores.push('La URL de la imagen debe ser válida');
        }
    }

    if (errores.length > 0) {
        return res.status(400).json({
            error: 'Errores de validación',
            detalles: errores
        });
    }

    next();
};

// Validación para cambiar estado destacado
const validarCambiarDestacado = (req, res, next) => {
    const { destacado } = req.body;
    
    if (destacado === undefined || typeof destacado !== 'boolean') {
        return res.status(400).json({
            error: 'El campo destacado es obligatorio y debe ser un valor booleano'
        });
    }

    next();
};

module.exports = {
    validarCrearNoticia,
    validarActualizarNoticia,
    validarCambiarDestacado
};