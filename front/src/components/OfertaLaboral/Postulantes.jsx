import React, { useEffect, useState } from "react";
import { getPostulantesDeOfertaRequest } from "../../api/ofertaLaboralApi";

export default function PostulantesDeOferta({ idOferta }) {
  const [postulantes, setPostulantes] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getPostulantesDeOfertaRequest(idOferta);
        setPostulantes(res);
      } catch (error) {
        console.error("Error al cargar postulantes", error);
      } finally {
        setLoading(false);
      }

    };
    fetch();
  }, [idOferta]);

  if (loading) return <p>Cargando postulantes...</p>;
  if (postulantes.length === 0) return <p>No hay postulantes.</p>;

  return (
    <table className="text-sm text-gray-800 rounded-2xl shadow-2xl">
      < thead className=" bg- rounded-3xl text-s text-gray-900  uppercase tracking-wider" >
        <tr>
          <th className="px-4 py-2">Nombre</th>
          <th className="px-4 py-2">Correo</th>
          <th className="px-4 py-2">Número</th>
          <th className="px-4 py-2">CV</th>
        </tr>
      </thead >
      <tbody>
        {postulantes.map((p) => (
          <tr
            key={p._id}
            className="hover:bg-green-200 transition duration-200 cursor-pointer" >

            <td className="px-4 py-2">{p.nombreCompleto}</td>
            <td className="px-4 py-2">{p.correo}</td>
            <td className="px-4 py-2">{p.numero}</td>
            <td className="px-4 py-2">
              <button className="bg-blue-800 text-white px-3 py-1 rounded hover:bg-blue-700" >
                Descargar CV
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table >
  );
}