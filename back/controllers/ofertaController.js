const OfertaLaboral = require("../models/OfertaLaboral")
const { AREAS_LABORALES, TIPOS_CONTRATO, MODALIDAD, REQUISITOS, ESTADO } = require('../enums/OfertaLaboral.enum');
// Crear o actualizar una oferta laboral
const createOrUpdateOferta = async (req, res) => {
    const { id } = req.params;  // ID de la oferta laboral a actualizar, si existe
    const ofertaData = req.body;  // Los datos de la oferta laboral recibidos en el cuerpo de la solicitud
  
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
      oferta = new OfertaLaboral(ofertaData);
      await oferta.save();
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
      const ofertas = await OfertaLaboral.find();  // Obtener todas las ofertas laborales
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


module.exports = {
  createOrUpdateOferta,
  getOferta,
  getOfertas,
  disableOferta,
  deleteOferta,
  getOptions
};
