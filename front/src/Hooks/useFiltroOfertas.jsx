import { useState, useMemo } from "react";

export default function useFiltrosOferta(ofertas) {
  const [filtros, setFiltros] = useState({
    area: [],
    modalidad: [],
    tipoContrato: [],
  });

  const [searchTerm, setSearchTerm] = useState("");

  const agregarFiltro = (tipo, valor) => {
    if (!valor || filtros[tipo].includes(valor)) return;
    setFiltros((prev) => ({
      ...prev,
      [tipo]: [...prev[tipo], valor],
    }));
  };

  const quitarFiltro = (tipo, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [tipo]: prev[tipo].filter((item) => item !== valor),
    }));
  };

  const ofertasFiltradas = useMemo(() => {
    return ofertas.filter((oferta) => {
      const cumpleArea = filtros.area.length
        ? filtros.area.includes(oferta.area)
        : true;
      const cumpleModalidad = filtros.modalidad.length
        ? filtros.modalidad.includes(oferta.modalidad)
        : true;
      const cumpleContrato = filtros.tipoContrato.length
        ? filtros.tipoContrato.includes(oferta.tipoContrato)
        : true;
      const cumpleBusqueda =
        searchTerm.trim() === "" ||
        oferta.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        oferta.empresa.toLowerCase().includes(searchTerm.toLowerCase());

      return cumpleArea && cumpleModalidad && cumpleContrato && cumpleBusqueda;
    });
  }, [ofertas, filtros, searchTerm]);

  return {
    filtros,
    setFiltros,
    agregarFiltro,
    quitarFiltro,
    searchTerm,
    setSearchTerm,
    ofertasFiltradas,
  };
}
