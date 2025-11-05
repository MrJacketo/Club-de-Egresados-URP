import React from "react";
import { Calendar, Star } from "lucide-react";

function SidebarDerecha() {
  const eventos = [
    {
      id: 1,
      titulo: "LIDERAZGO PARA MUJERES EJECUTIVAS",
      subtitulo: "Convertir visión en acción",
      fecha: "09 de octubre",
      precio: "S/ 59",
      descripcion: "Este programa se enfoca en convertir tu potencial en acción concreta, diseñando este reciclaje y liberando con autenticidad.",
      botones: ["Recomendar", "Enviar"]
    },
    {
      id: 2,
      titulo: "PACÍFICO BUSINESS SCHOOL",
      subtitulo: "Programa de desarrollo ejecutivo",
      fecha: "17 de mayo 2024",
      precio: "S/ 120",
      descripcion: "El mensajero formativo no es imposible. Se construye con estrategia, visión y firmeza.",
      botones: ["Recomendar", "Enviar"]
    }
  ];

  const noticias = [
    {
      id: 1,
      categoria: "Tecnología",
      destacado: true,
      titulo: "Xiaomi ha abierto su primera tienda en Latinoamérica",
      contenido: "Felicidades a Xiaomi por innovar en el mercado Latinoamericano! 🎉",
      tipo: "Destacado"
    },
    {
      id: 2,
      categoria: "General",
      destacado: true,
      titulo: "Encuentro Anual de Egresados 2025",
      contenido: "La Universidad Ricardo Palma invita a todos sus egresados al Encuentro Anual 2025. Será una oportuni... 👥",
      tipo: "Destacado"
    }
  ];

  return (
    <aside style={{ display: 'block', width: '100%' }}>
      <div className="bg-white rounded-2xl p-4 mb-6">
        <h2 className="text-green-600 font-bold text-lg mb-3">Eventos recomendados</h2>
        <div className="space-y-4">
          {eventos.map((evento) => (
            <div key={evento.id} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-3">
                <h3 className="font-bold text-sm">{evento.titulo}</h3>
                <p className="text-xs opacity-90">{evento.subtitulo}</p>
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-600 mb-2">{evento.descripcion}</p>
                <div className="flex items-center justify-between text-xs text-gray-700 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{evento.fecha}</span>
                  </div>
                  <div className="font-bold text-green-700">{evento.precio}</div>
                </div>
                <div className="flex justify-between gap-2">
                  {evento.botones.map((boton, index) => (
                    <button
                      key={index}
                      className="flex items-center gap-2 bg-white !bg-white text-black px-3 py-2 rounded-lg shadow-sm transition-colors text-xs"
                    >
                      {boton}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 mb-6">
        <h2 className="text-green-600 font-bold text-lg mb-3">Noticias</h2>
        <div className="space-y-4">
          {noticias.map((noticia) => (
            <div key={noticia.id} className="border border-gray-200 rounded-xl p-3 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                  {noticia.categoria}
                </span>
                {noticia.destacado ? (
                  <div className="flex items-center gap-1 text-xs text-amber-600">
                    <Star size={12} fill="currentColor" />
                    <span>{noticia.tipo}</span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-500">{noticia.tipo}</span>
                )}
              </div>
              
              <h3 className="font-semibold text-sm text-gray-800 mb-2 line-clamp-2">
                {noticia.titulo}
              </h3>
              <p className="text-xs text-gray-600 line-clamp-2">
                {noticia.contenido}
              </p>
              
              {noticia.destacado && (
                <div className="mt-2 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4">
        <h2 className="text-green-600 font-bold text-lg mb-3">Tendencias</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="inline-block text-green-700 px-1 py-0.5 hover:text-green-600">#React</li>
          <li className="inline-block text-green-700 px-1 py-0.5 hover:text-green-600">#IngenieríaInformática</li>
          <li className="inline-block text-green-700 px-1 py-0.5 hover:text-green-600">#EgresadosURP</li>
        </ul>
      </div>
    </aside>
  );
}

export default SidebarDerecha;