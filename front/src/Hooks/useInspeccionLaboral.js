import { useState, useEffect } from "react";
import {
  getOfertasParaInspeccion,
  getEstadisticasInspeccion,
  getEmpresas,
  toggleBloqueoOferta,
  toggleSuspensionEmpresa,
  getDetalleOferta
} from "../api/inspeccionLaboralApi";

export const useInspeccionLaboral = () => {
  const [ofertas, setOfertas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [filtros, setFiltros] = useState({
    estado: "",
    empresa: "",
    search: "",
    page: 1,
    limit: 10
  });

  // Cargar ofertas
  const cargarOfertas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getOfertasParaInspeccion(filtros);
      setOfertas(response.data || []);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err.message || "Error al cargar ofertas");
      setOfertas([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar empresas
  const cargarEmpresas = async () => {
    try {
      const response = await getEmpresas();
      setEmpresas(response.data || []);
    } catch (err) {
      console.error("Error al cargar empresas:", err);
    }
  };

  // Cargar estadísticas
  const cargarEstadisticas = async () => {
    try {
      const response = await getEstadisticasInspeccion();
      setEstadisticas(response.data);
    } catch (err) {
      console.error("Error al cargar estadísticas:", err);
    }
  };

  // Bloquear/Desbloquear oferta
  const bloquearOferta = async (ofertaId, motivo = "") => {
    try {
      const response = await toggleBloqueoOferta(ofertaId, motivo);
      if (response.success) {
        await cargarOfertas();
        await cargarEstadisticas();
        return { success: true, message: response.message };
      }
      return { success: false, message: "Error al cambiar estado de oferta" };
    } catch (err) {
      return { success: false, message: err.message || "Error al cambiar estado de oferta" };
    }
  };

  // Suspender/Reactivar empresa
  const suspenderEmpresa = async (nombreEmpresa, suspender, motivo = "") => {
    try {
      const response = await toggleSuspensionEmpresa(nombreEmpresa, suspender, motivo);
      if (response.success) {
        await cargarOfertas();
        await cargarEmpresas();
        await cargarEstadisticas();
        return { success: true, message: response.message };
      }
      return { success: false, message: "Error al cambiar estado de empresa" };
    } catch (err) {
      return { success: false, message: err.message || "Error al cambiar estado de empresa" };
    }
  };

  // Obtener detalle de oferta
  const obtenerDetalleOferta = async (ofertaId) => {
    try {
      const response = await getDetalleOferta(ofertaId);
      return response.data;
    } catch (err) {
      throw new Error(err.message || "Error al obtener detalle");
    }
  };

  // Aplicar filtros
  const aplicarFiltros = (nuevosFiltros) => {
    setFiltros({ ...filtros, ...nuevosFiltros });
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      estado: "",
      empresa: "",
      search: "",
      page: 1,
      limit: 10
    });
  };

  // Cambiar página
  const cambiarPagina = (nuevaPagina) => {
    setFiltros({ ...filtros, page: nuevaPagina });
  };

  // Cargar datos iniciales
  useEffect(() => {
    cargarOfertas();
    cargarEstadisticas();
    cargarEmpresas();
  }, [filtros]);

  return {
    ofertas,
    empresas,
    estadisticas,
    loading,
    error,
    filtros,
    pagination,
    cargarOfertas,
    bloquearOferta,
    suspenderEmpresa,
    obtenerDetalleOferta,
    aplicarFiltros,
    limpiarFiltros,
    cambiarPagina
  };
};
