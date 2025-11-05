// src/pages/Admin/GestionForo.jsx
import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { AdminSidebarProvider, useAdminSidebar } from '../../context/adminSidebarContext';
import ModalRevisarPost from "../../components/ModeracionForo/ModalRevisarPost";
import ModalRevisarReportes from "../../components/ModeracionForo/ModalRevisarReportes";
import FiltrosModeracion from "../../components/ModeracionForo/FiltrosModeracion";
import MetricasModeracion from "../../components/ModeracionForo/MetricasModeracion";
import ListaPosts from "../../components/ModeracionForo/ListaPosts";
import ListaReportes from "../../components/ModeracionForo/ListaReportes";
import AccionesRapidas from "../../components/ModeracionForo/AccionesRapidas";
import { useAlerta } from '../../Hooks/useAlerta';
import { Download, RefreshCw } from 'lucide-react';

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
    contenido: "¡Gran oportunidad de inversión! ¡Hazte rico rápidamente con las criptomonedas! 🌤 No te pierdas esta oportunidad única. Visita mi sitio para más detalles: www.super-crypto-profits.scam",
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
  const { isCollapsed } = useAdminSidebar();
  const { mostrarAlerta } = useAlerta();
  
  // Estados principales
  const [modalPostAbierto, setModalPostAbierto] = useState(false);
  const [modalReporteAbierto, setModalReporteAbierto] = useState(false);
  const [postSeleccionado, setPostSeleccionado] = useState(null);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('pendiente');
  const [postsPendientes, setPostsPendientes] = useState(datosPosts);
  const [reportesActivos, setReportesActivos] = useState(datosReportes);

  // Funciones de filtrado
  const aplicarFiltros = () => {
    mostrarAlerta('✅ Filtros aplicados correctamente', 'success');
  };

  const limpiarFiltros = () => {
    setFiltroBusqueda('');
    setFiltroEstado('pendiente');
    mostrarAlerta('🔄 Filtros limpiados', 'success');
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
    mostrarAlerta(`✅ Post #${postId} aprobado correctamente`, 'success');
    cerrarModalPost();
  };

  const manejarOcultar = (postId, comentario) => {
    setPostsPendientes(posts => 
      posts.map(post => 
        post.id === postId ? { ...post, oculto: true } : post
      )
    );
    mostrarAlerta(`👁️ Post #${postId} ocultado correctamente`, 'warning');
    cerrarModalPost();
  };

  const manejarEliminar = (postId, comentario) => {
    setPostsPendientes(posts => posts.filter(post => post.id !== postId));
    mostrarAlerta(`🗑️ Post #${postId} eliminado correctamente`, 'success');
    cerrarModalPost();
  };

  const manejarResolverReporte = (reporteId, acciones, notas) => {
    setReportesActivos(reportes => reportes.filter(reporte => reporte.id !== reporteId));
    const accionesTexto = acciones.length > 0 ? acciones.join(', ') : 'sin acciones específicas';
    mostrarAlerta(`✅ Reporte #${reporteId} resuelto (${accionesTexto})`, 'success');
    cerrarModalReporte();
  };

  const manejarIgnorarReporte = (reporteId, notas) => {
    setReportesActivos(reportes => reportes.filter(reporte => reporte.id !== reporteId));
    mostrarAlerta(`👁️ Reporte #${reporteId} ignorado`, 'warning');
    cerrarModalReporte();
  };

  const ocultarPost = (postId) => {
    setPostsPendientes(posts => 
      posts.map(post => 
        post.id === postId ? { ...post, oculto: true } : post
      )
    );
    mostrarAlerta(`👁️ Post ocultado correctamente`, 'warning');
  };

  const ocultarReporte = (reporteId) => {
    setReportesActivos(reportes => 
      reportes.map(reporte => 
        reporte.id === reporteId ? { ...reporte, oculto: true } : reporte
      )
    );
    mostrarAlerta(`👁️ Reporte ocultado correctamente`, 'warning');
  };

  const restaurarTodo = () => {
    setPostsPendientes(postsPendientes.map(p => ({ ...p, oculto: false })));
    setReportesActivos(reportesActivos.map(r => ({ ...r, oculto: false })));
    setFiltroEstado('pendiente');
    mostrarAlerta('🔄 Todos los elementos restaurados', 'success');
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
    });
  };

  const postsFiltrados = filtrarDatos(postsPendientes);
  const reportesFiltrados = filtrarDatos(reportesActivos);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <main className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'} p-6`}>
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between mb-8">
          <h1 className="text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
              Moderación del Foro
            </span>
          </h1>
          <div className="flex gap-4">
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #16a34a, #14b8a6)', border: 'none' }}>
              <Download className="w-5 h-5" style={{ color: '#fff' }} />
              <span className="text-white text-sm font-bold">Exportar</span>
            </button>
            <button onClick={restaurarTodo}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #16a34a, #14b8a6)', border: 'none' }}>
              <RefreshCw className="w-5 h-5" style={{ color: '#fff' }} />
              <span className="text-white text-sm font-bold">Actualizar</span>
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-8"></div>

        {/* Componentes Modulares */}
        <MetricasModeracion 
          postsPendientes={postsPendientes} 
          reportesActivos={reportesActivos} 
          filtroEstado={filtroEstado} 
        />

        <FiltrosModeracion
          filtroBusqueda={filtroBusqueda}
          setFiltroBusqueda={setFiltroBusqueda}
          filtroEstado={filtroEstado}
          setFiltroEstado={setFiltroEstado}
          aplicarFiltros={aplicarFiltros}
          limpiarFiltros={limpiarFiltros}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ListaPosts
            posts={postsFiltrados}
            filtroEstado={filtroEstado}
            onAbrirModal={abrirModalPost}
            onOcultarPost={ocultarPost}
            onLimpiarFiltros={limpiarFiltros}
          />

          <ListaReportes
            reportes={reportesFiltrados}
            filtroEstado={filtroEstado}
            onAbrirModal={abrirModalReporte}
            onOcultarReporte={ocultarReporte}
            onLimpiarFiltros={limpiarFiltros}
          />
        </div>

        <div className="border-b border-gray-200 mb-8"></div>

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
      </main>
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