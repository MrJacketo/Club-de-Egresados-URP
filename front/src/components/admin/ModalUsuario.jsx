import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Typography,
  Divider,
  Box,
  InputAdornment,
  FormHelperText
} from '@mui/material';
import { Close, Person, Email, Lock, School, Work, Grade } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

const ModalUsuario = ({ 
  open, 
  onClose, 
  onSave, 
  user = null, 
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    rol: user?.rol || 'egresado',
    anioEgreso: user?.anioEgreso || new Date().getFullYear(),
    carrera: user?.carrera || '',
    gradoAcademico: user?.gradoAcademico || 'Egresado',
    activo: user?.activo !== undefined ? user.activo : true
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const carreras = [
    "Administración y Gerencia",
    "Administración de Negocios Globales", 
    "Arquitectura",
    "Biología",
    "Contabilidad y Finanzas",
    "Derecho y Ciencia Política",
    "Economía",
    "Ingeniería Civil",
    "Ingeniería Electrónica", 
    "Ingeniería Industrial",
    "Ingeniería Informática",
    "Ingeniería Mecatrónica",
    "Marketing Global y Administración Comercial",
    "Medicina Humana",
    "Medicina Veterinaria",
    "Psicología",
    "Traducción e Interpretación",
    "Turismo, Hotelería y Gastronomía"
  ];

  const gradosAcademicos = [
    "Egresado",
    "Bachiller", 
    "Titulado",
    "Magíster",
    "Doctorado"
  ];

  const roles = [
    { value: 'egresado', label: 'Egresado' },
    { value: 'admin', label: 'Administrador' },
    { value: 'moderador', label: 'Moderador' },
    { value: 'inspector_laboral', label: 'Inspector Laboral' },
    { value: 'empresa', label: 'Empresa' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!isEditing && !formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    }

    if (isEditing && formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.rol === 'egresado') {
      if (!formData.carrera) {
        newErrors.carrera = 'La carrera es obligatoria para egresados';
      }
      if (!formData.anioEgreso || formData.anioEgreso < 1950 || formData.anioEgreso > new Date().getFullYear() + 5) {
        newErrors.anioEgreso = 'Año de egreso inválido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const userData = { ...formData };
      
      // Remove academic fields if not egresado
      if (userData.rol !== 'egresado') {
        delete userData.anioEgreso;
        delete userData.carrera;
        delete userData.gradoAcademico;
      }

      // Remove password if empty during edit
      if (isEditing && !userData.password) {
        delete userData.password;
      }

      await onSave(userData, user?._id);
      
      // No mostrar toast aquí - se maneja en el componente padre
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        rol: 'egresado',
        anioEgreso: new Date().getFullYear(),
        carrera: '',
        gradoAcademico: 'Egresado',
        activo: true
      });
      
    } catch (error) {
      toast.error(error.message || 'Error al guardar usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  // Reset form when user changes
  React.useEffect(() => {
    if (user && isEditing) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        rol: user.rol || 'egresado',
        anioEgreso: user.anioEgreso || new Date().getFullYear(),
        carrera: user.carrera || '',
        gradoAcademico: user.gradoAcademico || 'Egresado',
        activo: user.activo !== undefined ? user.activo : true
      });
    } else if (!isEditing) {
      setFormData({
        name: '',
        email: '',
        password: '',
        rol: 'egresado',
        anioEgreso: new Date().getFullYear(),
        carrera: '',
        gradoAcademico: 'Egresado',
        activo: true
      });
    }
  }, [user, isEditing, open]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }
      }}
    >
      <Box sx={{ 
        background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)', 
        p: 3, 
        position: 'relative',
        borderRadius: '16px 16px 0 0'
      }}>
        <IconButton
          onClick={handleClose}
          sx={{ 
            position: 'absolute', 
            top: 8, 
            right: 8,
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
          }}
        >
          <Close />
        </IconButton>
        <DialogTitle sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem', m: 0, pr: 6, p: 0 }}>
          {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        </DialogTitle>
        <Typography sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
          {isEditing 
            ? 'Modifica los datos del usuario seleccionado' 
            : 'Completa la información para registrar un nuevo usuario'
          }
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* Información Básica */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: '#374151', fontWeight: 600 }}>
                <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                Información Básica
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Nombre completo"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#10b981' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Correo electrónico"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                  required
                  disabled={isEditing} // No permite cambiar email al editar
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: '#10b981' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label={isEditing ? "Nueva contraseña (opcional)" : "Contraseña"}
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password || (isEditing ? "Déjalo vacío para mantener la actual" : "")}
                  fullWidth
                  required={!isEditing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#10b981' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <FormControl fullWidth>
                  <InputLabel>Rol del usuario</InputLabel>
                  <Select
                    value={formData.rol}
                    onChange={(e) => handleInputChange('rol', e.target.value)}
                    label="Rol del usuario"
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.value} value={role.value}>
                        {role.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Información Académica - Solo para egresados */}
            {formData.rol === 'egresado' && (
              <>
                <Divider />
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: '#374151', fontWeight: 600 }}>
                    <School sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Información Académica
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl fullWidth error={!!errors.carrera}>
                      <InputLabel>Carrera</InputLabel>
                      <Select
                        value={formData.carrera}
                        onChange={(e) => handleInputChange('carrera', e.target.value)}
                        label="Carrera"
                        required
                      >
                        {carreras.map((carrera) => (
                          <MenuItem key={carrera} value={carrera}>
                            {carrera}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.carrera && (
                        <FormHelperText>
                          {errors.carrera}
                        </FormHelperText>
                      )}
                    </FormControl>

                    <TextField
                      label="Año de egreso"
                      type="number"
                      value={formData.anioEgreso}
                      onChange={(e) => handleInputChange('anioEgreso', parseInt(e.target.value) || '')}
                      error={!!errors.anioEgreso}
                      helperText={errors.anioEgreso}
                      fullWidth
                      required
                      inputProps={{ min: 1950, max: new Date().getFullYear() + 5 }}
                    />

                    <FormControl fullWidth>
                      <InputLabel>Grado académico</InputLabel>
                      <Select
                        value={formData.gradoAcademico}
                        onChange={(e) => handleInputChange('gradoAcademico', e.target.value)}
                        label="Grado académico"
                      >
                        {gradosAcademicos.map((grado) => (
                          <MenuItem key={grado} value={grado}>
                            {grado}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </>
            )}

          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleClose}
            sx={{ 
              px: 4, 
              py: 1.5, 
              borderRadius: '12px',
              color: '#6b7280',
              '&:hover': { backgroundColor: '#f3f4f6' }
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ 
              px: 4, 
              py: 1.5, 
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)'
              }
            }}
          >
            {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Usuario')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModalUsuario;