import React, { useState } from "react";
import { AREAS_LABORALES, MODALIDAD, TIPOS_CONTRATO } from "../../constants/OfertaLaboral/OfertaLaboral.enum";

export default function FiltrosOferta({ filtros, agregarFiltro, quitarFiltro }) {
  const [selects, setSelects] = useState({ area: "", modalidad: "", tipoContrato: "" });

  const handleChange = (tipo, value) => {
    agregarFiltro(tipo, value);
    setSelects((prev) => ({ ...prev, [tipo]: "" })); // reset selector
  };

  const renderSelect = (tipo, opciones, label) => (
    <select
      value={selects[tipo]}
      onChange={(e) => handleChange(tipo, e.target.value)}
      className="w-full p-3 font-semibold border-none rounded-lg bg-white text-gray-700"
    >
      <option value="">{label}</option>
      {opciones.map((op) => (
        <option key={op} value={op}>
          {op}
        </option>
      ))}
    </select>
  );

  const renderChips = (tipo) =>
    filtros[tipo].map((item) => (
      <div
        key={item}
        className="bg-[#146e44a2] text-white font-semibold py-1 px-4 rounded-full flex items-center gap-2"
      >
        {item}
        <div onClick={() => quitarFiltro(tipo, item)} className="text-sm font-bold cursor-pointer hover:text-[#222] transition-all">
          ✕
        </div>
      </div>
    ));

  return (
    <div className="w-full flex flex-col gap-4 mb">
      <div className="flex flex-col md:flex-row gap-3">
        {renderSelect("area", AREAS_LABORALES, "Seleccionar área")}
        {renderSelect("modalidad", MODALIDAD, "Seleccionar modalidad")}
        {renderSelect("tipoContrato", TIPOS_CONTRATO, "Tipo de Contrato")}
      </div>
      <div className="flex flex-wrap gap-3">
        {renderChips("area")}
        {renderChips("modalidad")}
        {renderChips("tipoContrato")}
      </div>
    </div>
  );
}
