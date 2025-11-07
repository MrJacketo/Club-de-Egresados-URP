// src/pages/Admin/GestionForo.jsx
import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { AdminSidebarProvider, useAdminSidebar } from '../../context/adminSidebarContext';
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

// Datos de ejemplo incluidos en el mismo archivo
const datosPosts = [
  {
    id: 1,
    titulo: "Busco un nuevo libro de Sci-fi",
    autor: "Juan Pérez",
    fecha: "Hace 2h",
    tipo: "Pregunta",
    contenido: "Hola comunidad, estoy buscando recomendaciones de libros de ciencia ficción recientes. ¿Alguien tiene alguna sugerencia? Me gustan autores como Isaac Asimov y Philip K. Dick.",
    reportes: 0,
    comentarios: 3,
    oculto: false
  },
  {
    id: 2,
    titulo: "OFERTA IMBATIBLE!!",
    autor: "Diana Perez",
    fecha: "Hace 1h",
    tipo: "Anuncio",
    contenido: "¡COMPRA YA! Productos increíbles a precios insuperables. No pierdas esta oportunidad única. Contacta ahora mismo!!!",
    reportes: 5,
    comentarios: 0,
    oculto: false
  },
  {
    id: 3,
    titulo: "¿Alguien quiere comprar productos?",
    autor: "Mauricio Perez",
    fecha: "Hace 3h",
    tipo: "Comercial",
    contenido: "Hola, tengo algunos productos para vender. ¿Están interesados? Pueden contactarme por mensaje privado para más información.",
    reportes: 1,
    comentarios: 2,
    oculto: false
  }
];

const datosReportes = [
  {
    id: 7821,
    titulo: "Spam Comercial",
    autor: "Piero Gomez",
    fecha: "Hace 2h",
    tipo: "Anuncio",
    contenido: "¡Gran oportunidad de inversión! ¡Hazte rico rápidamente con las criptomonedas! No te pierdas esta oportunidad única. Visita mi sitio para más detalles: www.super-crypto-profits.scam",
    reportes: 3,
    comentarios: 0,
    tipoViolacion: "Spam",
    reportadoPor: "Mauricio Aliaga",
    fechaReporte: "15 de Octubre, 2023, 10:45 AM",
    razon: "Este usuario está publicando repetidamente enlaces a sitios externos no relacionados con el tema de la conversación. Parece un bot.",
    oculto: false
  },
  {
    id: 9512,
    titulo: "Contenido Inapropiado",
    autor: "Diana Gomez",
    fecha: "Hace 15min",
    tipo: "Discusión",
    contenido: "Contenido ofensivo y lenguaje inapropiado en este post...",
    reportes: 1,
    comentarios: 5,
    tipoViolacion: "Contenido Inapropiado",
    reportadoPor: "Pepe Gonzalez",
    fechaReporte: "15 de Octubre, 2023, 11:20 AM",
    razon: "Lenguaje ofensivo y comentarios inapropiados hacia otros usuarios.",
    oculto: false
  },
  {
    id: 6734,
    titulo: "Información Falsa",
    autor: "Luis Diaz",
    fecha: "Hace 45min",
    tipo: "Información",
    contenido: "Información incorrecta sobre temas importantes...",
    reportes: 2,
    comentarios: 8,
    tipoViolacion: "Información Falsa",
    reportadoPor: "Luisa Ramirez",
    fechaReporte: "15 de Octubre, 2023, 10:15 AM",
    razon: "Difusión de información médica falsa y potencialmente peligrosa.",
    oculto: false
  }
];

// Componente interno que usa el contexto
const GestionForoContent = () => {
  const { collapsed } = useAdminSidebar();
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
  const [postsPendientes, setPostsPendientes] = useState(datosPosts);
  const [reportesActivos, setReportesActivos] = useState(datosReportes);

  // Funciones de filtrado
  const limpiarFiltros = () => {
    setFiltroBusqueda('');
    setFiltroEstado('pendiente');
    setFiltroTipo('');
    setOrdenarPor('recent');
    mostrarAlerta('Filtros limpiados', 'success');
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

  // Handlers para acciones
  const manejarAprobar = (postId, comentario) => {
    setPostsPendientes(posts => posts.filter(post => post.id !== postId));
    mostrarAlerta(`Post aprobado correctamente`, 'success');
    cerrarModalPost();
  };

  const manejarOcultar = (postId, comentario) => {
    setPostsPendientes(posts => 
      posts.map(post => 
        post.id === postId ? { ...post, oculto: true } : post
      )
    );
    mostrarAlerta(`Post ocultado correctamente`, 'warning');
    cerrarModalPost();
  };

  const manejarEliminar = (postId, comentario) => {
    setPostsPendientes(posts => posts.filter(post => post.id !== postId));
    mostrarAlerta(`Post eliminado correctamente`, 'success');
    cerrarModalPost();
  };

  const manejarResolverReporte = (reporteId, acciones, notas) => {
    setReportesActivos(reportes => reportes.filter(reporte => reporte.id !== reporteId));
    const accionesTexto = acciones.length > 0 ? acciones.join(', ') : 'sin acciones específicas';
    mostrarAlerta(`Reporte resuelto (${accionesTexto})`, 'success');
    cerrarModalReporte();
  };

  const manejarIgnorarReporte = (reporteId, notas) => {
    setReportesActivos(reportes => reportes.filter(reporte => reporte.id !== reporteId));
    mostrarAlerta(`Reporte ignorado`, 'warning');
    cerrarModalReporte();
  };

  const ocultarPost = (postId) => {
    setPostsPendientes(posts => 
      posts.map(post => 
        post.id === postId ? { ...post, oculto: true } : post
      )
    );
    mostrarAlerta('Post ocultado correctamente', 'warning');
  };

  const ocultarReporte = (reporteId) => {
    setReportesActivos(reportes => 
      reportes.map(reporte => 
        reporte.id === reporteId ? { ...reporte, oculto: true } : reporte
      )
    );
    mostrarAlerta('Reporte ocultado correctamente', 'warning');
  };

  const restaurarTodo = () => {
    setPostsPendientes(postsPendientes.map(p => ({ ...p, oculto: false })));
    setReportesActivos(reportesActivos.map(r => ({ ...r, oculto: false })));
    setFiltroEstado('pendiente');
    mostrarAlerta('Todos los elementos restaurados', 'success');
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

  const totalPosts = postsPendientes.length;
  const postsActivos = postsPendientes.filter(p => !p.oculto).length;
  const totalReportes = reportesActivos.length;
  const reportesPendientes = reportesActivos.filter(r => !r.oculto).length;

  const tasaActividad = totalPosts > 0 ? ((postsActivos / totalPosts) * 100).toFixed(1) : 0;
  const tasaReportes = totalReportes > 0 ? ((reportesPendientes / totalReportes) * 100).toFixed(1) : 0;

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
    <div 
      className="flex min-h-screen pt-12"
      style={{ background: 'linear-gradient(to bottom right, #f9fafb, #ffffff)' }}
    >
      <AdminSidebar />
      
      <div className={`flex-1 transition-all duration-300 px-8 py-8 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl text-start font-bold mb-2">
            <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
              Moderación del Foro
            </span>
          </h1>
        </div>

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
            <p className="text-4xl font-bold text-gray-800">{reportesPendientes}</p>
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
                onClick={restaurarTodo}
                className="bg-gradient-to-r! from-green-500! to-teal-500! hover:from-green-600! hover:to-teal-600! text-white! px-6! py-4! rounded-xl! font-bold! transition-all! duration-300! hover:shadow-xl! hover:scale-105! flex! items-center! gap-2! whitespace-nowrap!"
              >
                <Download className="w-5 h-5" />
                Exportar
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
  );
};

// Componente principal
const GestionForo = () => {
  return (
    <AdminSidebarProvider>
      <GestionForoContent />
    </AdminSidebarProvider>
  );
};

export default GestionForo;