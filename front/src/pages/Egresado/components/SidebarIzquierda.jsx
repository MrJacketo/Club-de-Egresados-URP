import React from "react";
import { GraduationCap, Folder, Users, Mail, Calendar as CalendarIcon } from "lucide-react";

function SidebarIzquierda({ perfil, cambiarPerfil }) {
  const informacionAcademica = {
    nombreCompleto: "GONZALO LUIS QUINECHE SANTILLAN",
    añoEgreso: "2026",
    carrera: "Ingeniería Informática",
    gradoAcademico: "Egresado"
  };

  const elementosGuardados = [
    { tipo: "Grupos", icono: <Users size={16} />, cantidad: 3 },
    { tipo: "Newsletters", icono: <Mail size={16} />, cantidad: 5 },
    { tipo: "Eventos", icono: <CalendarIcon size={16} />, cantidad: 2 }
  ];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const nuevaImagen = URL.createObjectURL(e.target.files[0]);
      cambiarPerfil(nuevaImagen);
    }
  };

  return (
    <aside style={{ display: 'block', width: '100%' }}>
      <div className="bg-white rounded-2xl p-4 mb-6">
        <h2 className="text-green-600 font-bold text-lg mb-4 flex items-center gap-2">
          <GraduationCap size={20} />
          Información Académica
        </h2>
        
        <div className="text-center mb-4">
          <label className="relative cursor-pointer">
            {perfil ? (
              <img src={perfil} alt="Perfil" className="w-20 h-20 mx-auto rounded-full object-cover mb-2" />
            ) : (
              <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full mb-2 flex items-center justify-center text-gray-500">
                +
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
          <h3 className="font-semibold text-gray-800">Gonzalo Quineche</h3>
          <p className="text-gray-500 text-sm">Estudiante URP</p>
        </div>

        <div className="space-y-3 border-t border-gray-100 pt-4">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Nombre Completo</label>
              <p className="text-sm font-semibold text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                {informacionAcademica.nombreCompleto}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Año de Egreso</label>
                <p className="text-sm font-semibold text-green-700 bg-green-50 px-3 py-2 rounded-lg text-center">
                  {informacionAcademica.añoEgreso}
                </p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Grado Académico</label>
                <p className="text-sm font-semibold text-green-700 bg-green-50 px-3 py-2 rounded-lg text-center">
                  {informacionAcademica.gradoAcademico}
                </p>
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Carrera</label>
              <p className="text-sm font-semibold text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                {informacionAcademica.carrera}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 mb-6">
        <h2 className="text-green-600 font-bold text-lg mb-3 flex items-center gap-2">
          <Folder size={20} />
          Elementos guardados
        </h2>
        <ul className="space-y-3">
          {elementosGuardados.map((item, index) => (
            <li key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-green-600">{item.icono}</span>
                <span>{item.tipo}</span>
              </div>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                {item.cantidad}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-2xl p-4">
        <h2 className="text-green-600 font-bold text-lg mb-3 flex items-center gap-2">
          <Users size={20} />
          Contactos
        </h2>
        <p className="text-sm text-gray-600 mb-3">Amplía tu red</p>
        <p className="text-xs text-gray-500 mb-4">Accede a información y herramientas exclusivas</p>
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <span className="text-sm font-medium text-green-800">Prueba 1 mes por 0 PEN</span>
          </div>
          <button className="flex items-center gap-2 bg-white !bg-white text-black px-3 py-2 rounded-lg shadow-sm transition-colors">
            Comenzar prueba
          </button>
        </div>
      </div>
    </aside>
  );
}

export default SidebarIzquierda;