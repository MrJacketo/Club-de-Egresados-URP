const { supabaseAdmin } = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

/**
 * Valida el archivo antes de subirlo
 * @param {Object} file - Archivo de multer
 * @returns {boolean} True si es válido
 */
const validateFile = (file) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error('Tipo de archivo no permitido. Solo se aceptan PDF, DOC y DOCX');
  }

  if (file.size > maxSize) {
    throw new Error('El archivo es demasiado grande. Máximo 10MB');
  }

  return true;
};

/**
 * Sube un archivo CV a Supabase Storage
 * @param {Object} file - Archivo de multer
 * @param {string} userId - ID del usuario que sube el CV
 * @returns {Promise<Object>} Datos del archivo subido
 */
const uploadCV = async (file, userId) => {
  try {
    // Validar archivo
    validateFile(file);

    // Generar nombre único para el archivo
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `cv_${userId}_${uuidv4()}.${fileExtension}`;
    const filePath = `curriculums/${fileName}`;

    // Subir archivo a Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('curriculum-files')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error al subir archivo a Supabase:', error);
      throw new Error(`Error al subir CV: ${error.message}`);
    }

    // Obtener URL pública del archivo
    const { data: urlData } = supabaseAdmin.storage
      .from('curriculum-files')
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      fileName: fileName,
      filePath: filePath,
      originalName: file.originalname
    };
  } catch (error) {
    console.error('Error en uploadCV:', error);
    throw error;
  }
};

/**
 * Elimina un CV de Supabase Storage
 * @param {string} filePath - Ruta del archivo en Supabase
 * @returns {Promise<boolean>} True si se eliminó correctamente
 */
const deleteCV = async (filePath) => {
  try {
    const { error } = await supabaseAdmin.storage
      .from('curriculum-files')
      .remove([filePath]);

    if (error) {
      console.error('Error al eliminar archivo de Supabase:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error en deleteCV:', error);
    return false;
  }
};

/**
 * Obtiene una URL firmada para descargar un CV (URL temporal)
 * @param {string} filePath - Ruta del archivo en Supabase
 * @param {number} expiresIn - Tiempo de expiración en segundos (default: 3600 = 1 hora)
 * @returns {Promise<string>} URL firmada para descarga
 */
const getSignedUrlForCV = async (filePath, expiresIn = 3600) => {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from('curriculum-files')
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      console.error('Error al crear URL firmada:', error);
      throw new Error(`Error al generar URL de descarga: ${error.message}`);
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Error en getSignedUrlForCV:', error);
    throw error;
  }
};

module.exports = {
  uploadCV,
  deleteCV,
  getSignedUrlForCV,
  validateFile
};