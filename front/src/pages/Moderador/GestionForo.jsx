// src/pages/Admin/GestionForo.jsx
import React, { useState, useEffect } from 'react';
import ModeradorSidebar from '../Egresado/components/moderadorSidebar';
import { ModeradorSidebarProvider, useModeradorSidebar } from '../../context/moderadorSidebarContext';
import ModalRevisarPost from "../../components/ModeracionForo/ModalRevisarPost";
import ModalRevisarReportes from "../../components/ModeracionForo/ModalRevisarReportes";
import AccionesRapidas from "../../components/ModeracionForo/AccionesRapidas";
import { useAlerta } from '../../Hooks/useAlerta';
import { 
  Download, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Search,
  Eye,
  EyeOff,
  Clock,
  MessageCircle,
  User,
  Calendar,
  Flag,
  AlertCircle
} from 'lucide-react';

// APIs
import { 
  obtenerPublicaciones, 
  eliminarPublicacion,
  ocultarPublicacion,
  aprobarPublicacion
} from '../../api/foroPublicacionesApi';

// Componente interno que usa el contexto
const GestionForoContent = () => {
  const { collapsed } = useModeradorSidebar();
  const { mostrarAlerta } = useAlerta();
  
  // Estados principales
  const [modalPostAbierto, setModalPostAbierto] = useState(false);
  const [modalReporteAbierto, setModalReporteAbierto] = useState(false);
  const [postSeleccionado, setPostSeleccionado] = useState(null);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('pendiente');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [ordenarPor, setOrdenarPor] = useState('recent');
  
  // Estados para datos reales
  const [postsPendientes, setPostsPendientes] = useState([]);
  const [reportesActivos, setReportesActivos] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    totalReportes: 0,
    reportesPendientes: 0,
    reportesResueltos: 0
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos();
  }, []);

  // Cargar datos reales del backend
  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError(null);

      console.log('🔍 Iniciando carga de datos del foro...');

      // Probar conexión básica primero
      try {
        console.log('📡 Intentando obtener publicaciones...');
        const resPublicaciones = await obtenerPublicaciones();
        console.log('✅ Respuesta completa de publicaciones:', resPublicaciones);

        // Verificar el formato exacto de la respuesta
        if (resPublicaciones && resPublicaciones.success) {
          console.log('✅ Respuesta exitosa, procesando datos...');
          
          let publicaciones = [];
          
          // Intentar diferentes formatos de respuesta
          if (resPublicaciones.publicaciones) {
            publicaciones = resPublicaciones.publicaciones;
          } else if (resPublicaciones.data && resPublicaciones.data.publicaciones) {
            publicaciones = resPublicaciones.data.publicaciones;
          } else if (Array.isArray(resPublicaciones.data)) {
            publicaciones = resPublicaciones.data;
          }

          console.log('📋 Publicaciones encontradas:', publicaciones?.length || 0);

          if (publicaciones && publicaciones.length > 0) {
            // Filtrar publicaciones que no están aprobadas para moderación
            const publicacionesPendientes = publicaciones.filter(pub => 
              pub.estado !== 'aprobado' && pub.estado !== 'eliminado'
            );
            
            const publicacionesFormateadas = publicacionesPendientes.map((pub, index) => ({
              id: pub._id || pub.id || index,
              titulo: pub.titulo || 'Sin título',
              autor: pub.autor?.name || pub.autor?.nombre || pub.autor || 'Usuario desconocido',
              fecha: `Hace ${calcularTiempoTranscurrido(pub.createdAt || pub.fechaCreacion || new Date())}`,
              tipo: pub.categoria || pub.tipo || "Discusión",
              contenido: pub.contenido || 'Sin contenido',
              reportes: 0,
              comentarios: pub.comentarios?.length || 0,
              oculto: pub.oculto || false
            }));
            
            setPostsPendientes(publicacionesFormateadas);
            console.log('✅ Publicaciones pendientes formateadas:', publicacionesFormateadas.length);
          } else {
            console.log('⚠️ No hay publicaciones disponibles');
            setPostsPendientes([]);
          }
        } else {
          console.log('❌ Respuesta sin success flag o formato inesperado');
          setPostsPendientes([]);
        }
      } catch (errorPubs) {
        console.error('❌ Error específico al cargar publicaciones:', errorPubs);
        setPostsPendientes([]);
      }

      // Datos mock para reportes por ahora
      setReportesActivos([]);
      setEstadisticas({
        totalReportes: 0,
        reportesPendientes: 0,
        reportesResueltos: 0
      });

      console.log('✅ Carga de datos completada');

    } catch (error) {
      console.error('❌ Error general al cargar datos:', error);
      setError(`Error al cargar datos: ${error.message || error}`);
      mostrarAlerta(`Error: ${error.message || error}`, 'error');
    } finally {
      setCargando(false);
    }
  };

  // Función auxiliar para calcular tiempo transcurrido
  const calcularTiempoTranscurrido = (fecha) => {
    const ahora = new Date();
    const fechaPublicacion = new Date(fecha);
    const diferencia = ahora - fechaPublicacion;
    
    const minutos = Math.floor(diferencia / (1000 * 60));
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    
    if (minutos < 60) return `${minutos}min`;
    if (horas < 24) return `${horas}h`;
    return `${dias}d`;
  };

  // Función auxiliar para formatear fechas
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Funciones de filtrado
  const limpiarFiltros = async () => {
    setFiltroBusqueda('');
    setFiltroEstado('pendiente');
    setFiltroTipo('');
    setOrdenarPor('recent');
    await cargarDatos(); // Recargar datos con filtros limpiados
    mostrarAlerta('Filtros limpiados y datos recargados', 'success');
  };

  // Funciones para manejar modales
  const abrirModalPost = (post) => {
    setPostSeleccionado(post);
    setModalPostAbierto(true);
  };

  const cerrarModalPost = () => {
    setModalPostAbierto(false);
    setPostSeleccionado(null);
  };

  const abrirModalReporte = (reporte) => {
    setReporteSeleccionado(reporte);
    setModalReporteAbierto(true);
  };

  const cerrarModalReporte = () => {
    setModalReporteAbierto(false);
    setReporteSeleccionado(null);
  };

  // Handlers para acciones con APIs reales
  const manejarAprobar = async (postId, comentario) => {
    try {
      // Mostrar confirmación antes de aprobar
      const confirmacion = window.confirm(
        '¿Estás seguro de que quieres aprobar esta publicación?\n\n' +
        'La publicación será marcada como aprobada y no aparecerá en la lista de moderación.'
      );
      
      if (!confirmacion) {
        return; // Usuario canceló la acción
      }
      
      console.log('🔄 Aprobando publicación:', postId);
      
      const resultado = await aprobarPublicacion(postId);
      console.log('📊 Resultado de aprobar:', resultado);
      
      // Remover de la lista de posts pendientes (ya que está aprobado)
      setPostsPendientes(posts => posts.filter(post => post.id !== postId));
      
      mostrarAlerta(`Post aprobado correctamente`, 'success');
      cerrarModalPost();
      
      console.log('✅ Publicación aprobada exitosamente');
      
      // Recargar datos para reflejar cambios
      setTimeout(() => cargarDatos(), 500);
    } catch (error) {
      console.error('❌ Error al aprobar post:', error);
      mostrarAlerta(`Error al aprobar: ${error.message}`, 'error');
    }
  };

  const manejarOcultar = async (postId, comentario) => {
    try {
      console.log('🔄 Ocultando publicación:', postId);
      
      const resultado = await ocultarPublicacion(postId);
      console.log('📊 Resultado de ocultar:', resultado);
      
      // Marcar como oculto en el estado local inmediatamente
      setPostsPendientes(posts => 
        posts.map(post => 
          post.id === postId ? { ...post, oculto: true } : post
        )
      );
      
      mostrarAlerta(`Post ocultado correctamente`, 'warning');
      cerrarModalPost();
      
      console.log('✅ Publicación ocultada exitosamente');
      
      // Recargar datos para reflejar cambios
      setTimeout(() => cargarDatos(), 500);
    } catch (error) {
      console.error('❌ Error al ocultar post:', error);
      mostrarAlerta(`Error al ocultar: ${error.message}`, 'error');
    }
  };

  const manejarEliminar = async (postId, comentario) => {
    try {
      console.log('🔄 Eliminando publicación:', postId);
      
      const resultado = await eliminarPublicacion(postId);
      console.log('📊 Resultado de eliminar:', resultado);
      
      // Remover completamente de la lista
      setPostsPendientes(posts => posts.filter(post => post.id !== postId));
      
      mostrarAlerta(`Post eliminado correctamente`, 'success');
      cerrarModalPost();
      
      console.log('✅ Publicación eliminada exitosamente');
      
      // Recargar datos para reflejar cambios
      setTimeout(() => cargarDatos(), 500);
    } catch (error) {
      console.error('❌ Error al eliminar post:', error);
      mostrarAlerta(`Error al eliminar: ${error.message}`, 'error');
    }
  };

  const manejarResolverReporte = async (reporteId, acciones, notas) => {
    try {
      // Mapear acciones del modal a formato del backend
      let tipoAccion = 'ninguna';
      if (acciones.includes('eliminarContenido')) tipoAccion = 'eliminacion';
      else if (acciones.includes('banearUsuario')) tipoAccion = 'ban_temporal';
      else if (acciones.includes('advertirUsuario')) tipoAccion = 'advertencia';

      await resolverReporte(reporteId, {
        tipoAccion,
        motivo: notas,
        nuevoEstado: 'resuelto'
      });

      setReportesActivos(reportes => reportes.filter(reporte => reporte.id !== reporteId));
      const accionesTexto = acciones.length > 0 ? acciones.join(', ') : 'sin acciones específicas';
      mostrarAlerta(`Reporte resuelto (${accionesTexto})`, 'success');
      cerrarModalReporte();
    } catch (error) {
      console.error('Error al resolver reporte:', error);
      mostrarAlerta('Error al resolver el reporte', 'error');
    }
  };

  const manejarIgnorarReporte = async (reporteId, notas) => {
    try {
      await resolverReporte(reporteId, {
        tipoAccion: 'ninguna',
        motivo: notas || 'Reporte ignorado por moderador',
        nuevoEstado: 'ignorado'
      });

      setReportesActivos(reportes => reportes.filter(reporte => reporte.id !== reporteId));
      mostrarAlerta(`Reporte ignorado`, 'warning');
      cerrarModalReporte();
    } catch (error) {
      console.error('Error al ignorar reporte:', error);
      mostrarAlerta('Error al ignorar el reporte', 'error');
    }
  };

  const ocultarPost = async (postId) => {
    try {
      console.log('🔄 Ocultando post directo:', postId);
      
      const resultado = await ocultarPublicacion(postId);
      console.log('📊 Resultado de ocultar directo:', resultado);
      
      setPostsPendientes(posts => 
        posts.map(post => 
          post.id === postId ? { ...post, oculto: true } : post
        )
      );
      
      mostrarAlerta('Post ocultado correctamente', 'warning');
      console.log('✅ Post ocultado directamente');
      
      // Recargar datos para reflejar cambios
      setTimeout(() => cargarDatos(), 500);
    } catch (error) {
      console.error('❌ Error al ocultar post directo:', error);
      mostrarAlerta(`Error al ocultar: ${error.message}`, 'error');
    }
  };

  const ocultarReporte = async (reporteId) => {
    try {
      await ocultarReporteForo(reporteId);
      setReportesActivos(reportes => 
        reportes.map(reporte => 
          reporte.id === reporteId ? { ...reporte, oculto: true } : reporte
        )
      );
      mostrarAlerta('Reporte ocultado correctamente', 'warning');
    } catch (error) {
      console.error('Error al ocultar reporte:', error);
      mostrarAlerta('Error al ocultar el reporte', 'error');
    }
  };

  const restaurarTodo = async () => {
    try {
      // Recargar datos para restaurar vista
      await cargarDatos();
      setFiltroEstado('pendiente');
      mostrarAlerta('Vista restaurada - datos recargados', 'success');
    } catch (error) {
      console.error('Error al restaurar datos:', error);
      mostrarAlerta('Error al restaurar la vista', 'error');
    }
  };

  // Filtrar datos
  const filtrarDatos = (datos) => {
    return datos.filter(item => {
      if (filtroEstado === 'pendiente') return !item.oculto;
      if (filtroEstado === 'oculto') return item.oculto;
      return true;
    }).filter(item => {
      if (!filtroBusqueda) return true;
      const camposBusqueda = Object.values(item).join(' ').toLowerCase();
      return camposBusqueda.includes(filtroBusqueda.toLowerCase());
    }).filter(item => {
      if (!filtroTipo) return true;
      return item.tipo === filtroTipo;
    });
  };

  const postsFiltrados = filtrarDatos(postsPendientes);
  const reportesFiltrados = filtrarDatos(reportesActivos);

  // Usar estadísticas reales del backend
  const totalPosts = postsPendientes.length;
  const postsActivos = postsPendientes.filter(p => !p.oculto).length;
  const totalReportes = estadisticas.totalReportes || reportesActivos.length;
  const reportesPendientesCount = estadisticas.reportesPendientes || reportesActivos.filter(r => !r.oculto).length;

  const tasaActividad = totalPosts > 0 ? ((postsActivos / totalPosts) * 100).toFixed(1) : 0;
  const tasaReportes = totalReportes > 0 ? ((reportesPendientesCount / totalReportes) * 100).toFixed(1) : 0;

  // Mostrar indicador de carga
  if (cargando) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-white">
        <ModeradorSidebar />
        <div className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="pt-16 p-8 bg-white shadow-md">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-5xl text-start font-bold mb-2">
                <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                  Moderación del Foro
                </span>
              </h1>
              <p className="text-gray-600 font-medium text-lg mb-6">
                Gestionar y moderar contenido del foro universitario
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <span className="ml-4 text-lg text-gray-600">Cargando datos del foro...</span>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar mensaje de error
  if (error) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-white">
        <ModeradorSidebar />
        <div className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="pt-16 p-8 bg-white shadow-md">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-5xl text-start font-bold mb-2">
                <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                  Moderación del Foro
                </span>
              </h1>
              <p className="text-gray-600 font-medium text-lg mb-6">
                Gestionar y moderar contenido del foro universitario
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center h-64 text-center">
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
              <AlertCircle className="w-6 h-6 mx-auto mb-2" />
              <p className="font-medium">{error}</p>
              <button 
                onClick={cargarDatos}
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getBadgeColor = (tipo) => {
    switch(tipo) {
      case 'Pregunta':
        return 'bg-blue-100 text-blue-700';
      case 'Anuncio':
        return 'bg-orange-100 text-orange-700';
      case 'Discusión':
        return 'bg-purple-100 text-purple-700';
      case 'Comercial':
        return 'bg-yellow-100 text-yellow-700';
      case 'Información':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getViolacionColor = (tipo) => {
    switch(tipo) {
      case 'Spam':
        return 'bg-red-100 text-red-700';
      case 'Contenido Inapropiado':
        return 'bg-orange-100 text-orange-700';
      case 'Información Falsa':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-white">
      <ModeradorSidebar />
      
      <div className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        
        {/* Header con nuevo estilo */}
        <div className="pt-16 p-8 bg-white shadow-md">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl text-start font-bold mb-2">
              <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                Moderación del Foro
              </span>
            </h1>
            <p className="text-gray-600 font-medium text-lg mb-4">
              Gestionar y moderar contenido del foro universitario
            </p>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="px-8 py-8">
          {/* Métricas mejoradas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-xl">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm font-bold">100%</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Posts</p>
              <p className="text-4xl font-bold text-gray-800">{totalPosts}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-4 rounded-xl">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm font-bold">{tasaActividad}%</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Posts Activos</p>
              <p className="text-4xl font-bold text-gray-800">{postsActivos}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-100 p-4 rounded-xl">
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                </div>
                <div className="flex items-center gap-1 text-orange-600">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm font-bold">{tasaReportes}%</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Reportes Activos</p>
              <p className="text-4xl font-bold text-gray-800">{reportesPendientesCount}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-red-100 p-4 rounded-xl">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <div className="flex items-center gap-1 text-red-600">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm font-bold">100%</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Reportes</p>
              <p className="text-4xl font-bold text-gray-800">{totalReportes}</p>
            </div>
          </div>

          {/* Barra de búsqueda y filtros mejorada */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Búsqueda */}
              <div className="flex-1 relative group">
                <input
                  type="text"
                  placeholder="Buscar por título, autor o contenido..."
                  value={filtroBusqueda}
                  onChange={(e) => setFiltroBusqueda(e.target.value)}
                  className="w-full bg-gray-50 text-gray-800 px-6 py-4 pl-14 rounded-xl transition-all duration-300 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white focus:shadow-lg"
                  style={{ outline: 'none' }}
                />
                <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-green-500 transition-transform duration-300 group-hover:scale-110"
                  size={24}
                />
              </div>

              {/* Filtro por Estado */}
              <div className="relative">
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="bg-gray-50 text-gray-800 px-6 py-4 pr-12 rounded-xl cursor-pointer transition-all duration-300 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white focus:shadow-lg appearance-none min-w-[180px]"
                  style={{ outline: 'none' }}
                >
                  <option value="">Todos los estados</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="oculto">Oculto</option>
                </select>
              </div>

              {/* Filtro por Tipo */}
              <div className="relative">
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="bg-gray-50 text-gray-800 px-6 py-4 pr-12 rounded-xl cursor-pointer transition-all duration-300 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white focus:shadow-lg appearance-none min-w-[180px]"
                  style={{ outline: 'none' }}
                >
                  <option value="">Todos los tipos</option>
                  <option value="Pregunta">Pregunta</option>
                  <option value="Anuncio">Anuncio</option>
                  <option value="Discusión">Discusión</option>
                  <option value="Comercial">Comercial</option>
                </select>
              </div>

              {/* Ordenar */}
              <div className="relative">
                <select
                  value={ordenarPor}
                  onChange={(e) => setOrdenarPor(e.target.value)}
                  className="bg-gray-50 text-gray-800 px-6 py-4 pr-12 rounded-xl cursor-pointer transition-all duration-300 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white focus:shadow-lg appearance-none min-w-[180px]"
                  style={{ outline: 'none' }}
                >
                  <option value="recent">Más recientes</option>
                  <option value="oldest">Más antiguos</option>
                  <option value="reportes">Por reportes</option>
                </select>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2">
                {(filtroBusqueda || filtroEstado !== 'pendiente' || filtroTipo || ordenarPor !== 'recent') && (
                  <button
                    onClick={limpiarFiltros}
                    className="bg-gray-100! hover:bg-gray-200! text-gray-700! px-6! py-4! rounded-xl! font-bold! transition-all! duration-300! hover:shadow-lg! whitespace-nowrap!"
                  >
                    Limpiar
                  </button>
                )}
                
                <button
                  onClick={cargarDatos}
                  className="bg-blue-100! hover:bg-blue-200! text-blue-700! px-6! py-4! rounded-xl! font-bold! transition-all! duration-300! hover:shadow-lg! flex! items-center! gap-2! whitespace-nowrap!"
                  disabled={cargando}
                >
                  {cargando ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      Cargando...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Recargar
                    </>
                  )}
                </button>
                
                <button
                  onClick={restaurarTodo}
                  className="bg-gradient-to-r! from-green-500! to-teal-500! hover:from-green-600! hover:to-teal-600! text-white! px-6! py-4! rounded-xl! font-bold! transition-all! duration-300! hover:shadow-xl! hover:scale-105! flex! items-center! gap-2! whitespace-nowrap!"
                >
                  <Eye className="w-5 h-5" />
                  Vista Normal
                </button>
              </div>
            </div>
          </div>

          {/* Grid de Posts y Reportes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Posts Pendientes */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Posts Pendientes</h2>
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold">
                  {postsFiltrados.length}
                </span>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {postsFiltrados.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">No hay posts pendientes</p>
                    {filtroEstado === 'oculto' && (
                      <button
                        onClick={limpiarFiltros}
                        className="mt-4 text-green-600 hover:text-green-700 font-medium"
                      >
                        Ver todos los posts
                      </button>
                    )}
                  </div>
                ) : (
                  postsFiltrados.map((post) => (
                    <div
                      key={post.id}
                      className={`border-2 border-gray-100 rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:border-green-200 ${
                        post.oculto ? 'opacity-50 bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getBadgeColor(post.tipo)}`}>
                              {post.tipo}
                            </span>
                            {post.reportes > 0 && (
                              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                <Flag className="w-3 h-3" />
                                {post.reportes}
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-gray-800 mb-2">{post.titulo}</h3>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.contenido}</p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {post.autor}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.fecha}
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {post.comentarios}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirModalPost(post)}
                          className="flex-1 bg-green-600! hover:bg-green-700! text-white! px-4! py-2! rounded-lg! font-bold! transition-all! duration-300! flex! items-center! justify-center! gap-2!"
                        >
                          <Eye className="w-4 h-4" />
                          Revisar
                        </button>
                        <button
                          onClick={() => ocultarPost(post.id)}
                          className="bg-gray-100! hover:bg-gray-200! text-gray-700! px-4! py-2! rounded-lg! font-bold! transition-all! duration-300! flex! items-center! gap-2!"
                        >
                          {post.oculto ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Reportes Activos */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Reportes Activos</h2>
                <span className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-bold">
                  {reportesFiltrados.length}
                </span>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {reportesFiltrados.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">No hay reportes activos</p>
                    {filtroEstado === 'oculto' && (
                      <button
                        onClick={limpiarFiltros}
                        className="mt-4 text-green-600 hover:text-green-700 font-medium"
                      >
                        Ver todos los reportes
                      </button>
                    )}
                  </div>
                ) : (
                  reportesFiltrados.map((reporte) => (
                    <div
                      key={reporte.id}
                      className={`border-2 border-gray-100 rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:border-orange-200 ${
                        reporte.oculto ? 'opacity-50 bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getViolacionColor(reporte.tipoViolacion)}`}>
                              {reporte.tipoViolacion}
                            </span>
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getBadgeColor(reporte.tipo)}`}>
                              {reporte.tipo}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800 mb-2">{reporte.titulo}</h3>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{reporte.contenido}</p>

                      <div className="bg-orange-50 border-l-4 border-orange-400 p-3 mb-4 rounded">
                        <p className="text-sm text-gray-700">
                          <span className="font-bold">Reportado por:</span> {reporte.reportadoPor}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          <span className="font-bold">Razón:</span> {reporte.razon}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {reporte.autor}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {reporte.fechaReporte}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirModalReporte(reporte)}
                          className="flex-1 bg-orange-600! hover:bg-orange-700! text-white! px-4! py-2! rounded-lg! font-bold! transition-all! duration-300! flex! items-center! justify-center! gap-2!"
                        >
                          <Eye className="w-4 h-4" />
                          Revisar
                        </button>
                        <button
                          onClick={() => ocultarReporte(reporte.id)}
                          className="bg-gray-100! hover:bg-gray-200! text-gray-700! px-4! py-2! rounded-lg! font-bold! transition-all! duration-300! flex! items-center! gap-2!"
                        >
                          {reporte.oculto ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <AccionesRapidas />

          {/* Modales */}
          <ModalRevisarPost
            isOpen={modalPostAbierto}
            onClose={cerrarModalPost}
            post={postSeleccionado}
            onAprobar={manejarAprobar}
            onOcultar={manejarOcultar}
            onEliminar={manejarEliminar}
          />

          <ModalRevisarReportes
            isOpen={modalReporteAbierto}
            onClose={cerrarModalReporte}
            reporte={reporteSeleccionado}
            onResolver={manejarResolverReporte}
            onIgnorar={manejarIgnorarReporte}
          />
        </div>
      </div>
    </div>
  );
};

// Componente principal
const GestionForo = () => {
  return (
    <ModeradorSidebarProvider>
      <GestionForoContent />
    </ModeradorSidebarProvider>
  );
};

export default GestionForo;