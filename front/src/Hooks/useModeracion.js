import { useState, useEffect } from "react";
import {
  getEgresadosParaModerar,
  getEstadisticasModeracion,
  toggleEstadoEgresado,
  getDetalleEgresado
} from "../api/moderacionApi";

export const useModeracion = () => {
  const [egresados, setEgresados] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    estado: "",
    carrera: "",
    search: ""
  });

  // Cargar egresados
  const cargarEgresados = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getEgresadosParaModerar(filtros);
      setEgresados(response.data || []);
    } catch (err) {
      setError(err.message || "Error al cargar egresados");
      setEgresados([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar estadísticas
  const cargarEstadisticas = async () => {
    try {
      const response = await getEstadisticasModeracion();
      setEstadisticas(response.data);
    } catch (err) {
      console.error("Error al cargar estadísticas:", err);
    }
  };

  // Cambiar estado de egresado
  const cambiarEstadoEgresado = async (userId, activo, motivo = "") => {
    try {
      const response = await toggleEstadoEgresado(userId, activo, motivo);
      if (response.success) {
        // Actualizar lista de egresados
        await cargarEgresados();
        await cargarEstadisticas();
        return { success: true, message: response.message };
      }
      return { success: false, message: "Error al cambiar estado" };
    } catch (err) {
      return { success: false, message: err.message || "Error al cambiar estado" };
    }
  };

  // Obtener detalle de egresado
  const obtenerDetalleEgresado = async (userId) => {
    try {
      const response = await getDetalleEgresado(userId);
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
      carrera: "",
      search: ""
    });
  };

  // Cargar datos iniciales
  useEffect(() => {
    cargarEgresados();
    cargarEstadisticas();
  }, [filtros]);

  return {
    egresados,
    estadisticas,
    loading,
    error,
    filtros,
    cargarEgresados,
    cambiarEstadoEgresado,
    obtenerDetalleEgresado,
    aplicarFiltros,
    limpiarFiltros
  };
};
