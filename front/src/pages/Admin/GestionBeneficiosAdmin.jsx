import React, { useEffect, useState } from 'react';
import { getBeneficios } from '../../api/beneficiosApi';
import { Plus, RefreshCw, Edit2, Trash, Star, Calendar, X } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import { AdminSidebarProvider, useAdminSidebar } from '../../context/adminSidebarContext';

function AdminContent() {
  const [beneficios, setBeneficios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    tipo_beneficio: 'academico',
    empresa_asociada: '',
    fecha_inicio: new Date().toISOString().slice(0, 10),
    fecha_fin: '',
    estado: 'activo',
    url_detalle: '',
    imagen_beneficio: ''
  });
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchBeneficios();
  }, []);

  const fetchBeneficios = async () => {
    setLoading(true);
    try {
      const data = await getBeneficios();
      const normalized = (data || []).map((b) => ({
        id: b._id || b.id,
        titulo: b.titulo || b.nombre || '',
        descripcion: b.descripcion || b.detalle || '',
        tipo_beneficio: b.tipo_beneficio || b.tipo || 'academico',
        empresa_asociada: b.empresa_asociada || '',
        fecha_inicio: b.fecha_inicio ? new Date(b.fecha_inicio).toISOString().slice(0,10) : '',
        fecha_fin: b.fecha_fin ? new Date(b.fecha_fin).toISOString().slice(0,10) : '',
        estado: b.estado || 'activo',
        url_detalle: b.url_detalle || '',
        imagen_beneficio: b.imagen_beneficio || '',
        raw: b,
      }));
      setBeneficios(normalized);
    } catch (err) {
      console.error('error fetching beneficios', err);
      setBeneficios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    const newItem = { id: 'local-' + Date.now(), ...form };
    setBeneficios(prev => [newItem, ...prev]);
    resetForm();
  };

  const handleEdit = (item) => {
    setEditing(item.id);
    setForm({
      titulo: item.titulo,
      descripcion: item.descripcion,
      tipo_beneficio: item.tipo_beneficio || item.tipo || 'academico',
      empresa_asociada: item.empresa_asociada || '',
      fecha_inicio: item.fecha_inicio,
      fecha_fin: item.fecha_fin,
      estado: item.estado || 'activo',
      url_detalle: item.url_detalle || '',
      imagen_beneficio: item.imagen_beneficio || ''
    });
  };

  const handleUpdate = () => {
    setBeneficios(prev => prev.map((b) => b.id === editing ? { ...b, ...form } : b));
    setEditing(null);
    resetForm();
  };

  const handleDelete = (id) => {
    if (!confirm('¿Eliminar este beneficio del listado local? (esta acción es sólo local)')) return;
    setBeneficios(prev => prev.filter((b) => b.id !== id));
  };

  const resetForm = () => setForm({ 
    titulo: '', 
    descripcion: '', 
    tipo_beneficio: 'academico', 
    empresa_asociada: '',
    fecha_inicio: new Date().toISOString().slice(0, 10), 
    fecha_fin: '', 
    estado: 'activo',
    url_detalle: '',
    imagen_beneficio: ''
  });


  const { collapsed } = useAdminSidebar();

  return (
    <div className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>

      <div className="relative z-10 min-h-screen pt-20 px-8" style={{ background: 'linear-gradient(to bottom right, #f9fafb, #ffffff)', fontFamily: 'Inter, sans-serif' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between mb-8">
            <h1 className="text-5xl font-bold mb-2">
              <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                Gestión de Beneficios
              </span>
            </h1>
          </div>

          <div className="flex items-center justify-between mb-6 gap-3">
            <div className="flex-1 max-w-md">
              <input
                type="search"
                placeholder="Buscar beneficios..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-3 rounded-lg bg-white border border-gray-200 text-gray-900"
              />
            </div>

            <div className="flex items-center gap-2">
              <button onClick={fetchBeneficios} title="Recargar" className="flex items-center gap-2 px-4 py-2 text-white rounded-full font-bold transition-all duration-300 hover:scale-105 transform hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, #16a34a, #14b8a6)' }}><RefreshCw size={16} /> Recargar</button>
              <button onClick={()=>{ setEditing(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-6 py-3 text-white rounded-full font-bold transition-all duration-300 hover:scale-110 transform hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, #16a34a, #14b8a6)' }}><Plus size={16} /> Nuevo Beneficio</button>
            </div>
          </div>

          <section>
            <div className="flex flex-col gap-4">
              {loading && <div className="text-center text-gray-600">Cargando beneficios...</div>}
              {!loading && beneficios.length === 0 && <div className="text-center text-gray-600">No hay beneficios</div>}

              {beneficios
                .filter((b) => {
                  if (!query) return true;
                  const q = query.toLowerCase();
                  return (
                    (b.titulo || '').toLowerCase().includes(q) ||
                    (b.descripcion || '').toLowerCase().includes(q) ||
                    (b.tipo_beneficio || '').toLowerCase().includes(q) ||
                    (b.empresa_asociada || '').toLowerCase().includes(q)
                  );
                })
                .map((b) => (
                  <article key={b.id} className="bg-white rounded-2xl overflow-hidden flex shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer">
                    <div className="p-4 flex-1 flex items-start gap-4">
                      <div className="w-16 h-16 text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg" style={{ background: 'linear-gradient(135deg, #16a34a, #14b8a6)' }}><Star size={24} /></div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="text-left">
                            <h3 className="font-semibold text-lg text-gray-900 text-left">{b.titulo || 'Sin título'}</h3>
                            <div className="text-xs text-gray-600 text-left">{(b.tipo_beneficio || '').charAt(0).toUpperCase() + (b.tipo_beneficio || '').slice(1)}</div>
                            {b.empresa_asociada && <div className="text-xs text-green-600 text-left">{b.empresa_asociada}</div>}
                          </div>
                          <div className="text-xs text-gray-600 flex items-center gap-1">
                            <div className="p-1 bg-green-100 rounded-full">
                              <Calendar size={12} className="text-green-700" />
                            </div>
                            <span>{b.fecha_inicio || ''}{b.fecha_fin ? ` • ${b.fecha_fin}` : ''}</span>
                          </div>
                        </div>

                        <p className="mt-2 text-sm text-gray-600 line-clamp-3 text-left">{b.descripcion || '—'}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-3 p-4 min-h-full" style={{ background: 'linear-gradient(135deg, #16a34a, #14b8a6)' }}>
                      <button onClick={()=>{ handleEdit(b); setIsModalOpen(true); }} title="Editar" className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300 hover:scale-110 transform">
                        <Edit2 size={18} className="text-white" />
                      </button>
                      <button onClick={()=>handleDelete(b.id)} title="Eliminar" className="p-3 bg-white/20 hover:bg-red-500 rounded-full transition-all duration-300 hover:scale-110 transform">
                        <Trash size={18} className="text-white" />
                      </button>
                    </div>
                  </article>
                ))}
            </div>
          </section>

          {isModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60">
              <div className={`fixed inset-0 flex items-center justify-center transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'} p-4 sm:p-6 lg:p-8`}>
                <div className="bg-white rounded-2xl w-full max-w-4xl p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto transform transition-all duration-300 scale-100 mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{editing ? 'Editar beneficio' : 'Crear beneficio'}</h3>
                  <button onClick={()=>{ setIsModalOpen(false); setEditing(null); resetForm(); }} title="Cerrar" className="p-2 transition-colors" style={{ backgroundColor: 'transparent', border: 'none' }}>
                    <X size={18} className="text-green-600 hover:text-green-700" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-800 text-sm font-semibold mb-2 text-left">✏️ Título</label>
                      <input value={form.titulo} onChange={(e)=>setForm({...form, titulo: e.target.value})} className="w-full p-3 bg-gray-50 border-2 border-gray-400 rounded-xl text-gray-900 text-sm font-medium shadow-inner focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all duration-200" />
                    </div>
                    <div>
                      <label className="block text-gray-800 text-sm font-semibold mb-2 text-left">🏷️ Tipo de Beneficio</label>
                      <select value={form.tipo_beneficio} onChange={(e)=>setForm({...form, tipo_beneficio: e.target.value})} className="w-full p-3 bg-gray-50 border-2 border-gray-400 rounded-xl text-gray-900 text-sm font-medium shadow-inner focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all duration-200">
                        <option value="academico">Académico</option>
                        <option value="laboral">Laboral</option>
                        <option value="salud">Salud</option>
                        <option value="cultural">Cultural</option>
                        <option value="convenio">Convenio</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-800 text-sm font-semibold mb-2 text-left">🔄 Estado</label>
                      <select value={form.estado} onChange={(e)=>setForm({...form, estado: e.target.value})} className="w-full p-3 bg-gray-50 border-2 border-gray-400 rounded-xl text-gray-900 text-sm font-medium shadow-inner focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all duration-200">
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-800 text-sm font-semibold mb-2 text-left">📝 Descripción</label>
                    <textarea value={form.descripcion} onChange={(e)=>setForm({...form, descripcion: e.target.value})} className="w-full p-3 bg-gray-50 border-2 border-gray-400 rounded-xl text-gray-900 text-sm font-medium h-20 shadow-inner focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all duration-200 resize-none" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-800 text-sm font-semibold mb-2 text-left">🏢 Empresa Asociada</label>
                      <input value={form.empresa_asociada} onChange={(e)=>setForm({...form, empresa_asociada: e.target.value})} className="w-full p-3 bg-gray-50 border-2 border-gray-400 rounded-xl text-gray-900 text-sm font-medium shadow-inner focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all duration-200" />
                    </div>
                    <div>
                      <label className="block text-gray-800 text-sm font-semibold mb-2 text-left">🔗 URL Detalle / Código de Descuento</label>
                      <input type="text" value={form.url_detalle} onChange={(e)=>setForm({...form, url_detalle: e.target.value})} placeholder="https://ejemplo.com o CODIGO20" className="w-full p-3 bg-gray-50 border-2 border-gray-400 rounded-xl text-gray-900 text-sm font-medium shadow-inner focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all duration-200" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-800 text-sm font-semibold mb-2 text-left">📅 Fecha inicio</label>
                      <input type="date" value={form.fecha_inicio} onChange={(e)=>setForm({...form, fecha_inicio: e.target.value})} className="w-full p-3 bg-gray-50 border-2 border-gray-400 rounded-xl text-gray-900 text-sm font-medium shadow-inner focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all duration-200" />
                    </div>
                    <div>
                      <label className="block text-gray-800 text-sm font-semibold mb-2 text-left">🏁 Fecha fin</label>
                      <input type="date" value={form.fecha_fin} onChange={(e)=>setForm({...form, fecha_fin: e.target.value})} className="w-full p-3 bg-gray-50 border-2 border-gray-400 rounded-xl text-gray-900 text-sm font-medium shadow-inner focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all duration-200" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-800 text-sm font-semibold mb-2 text-left">🖼️ Imagen del Beneficio (URL)</label>
                    <input type="url" value={form.imagen_beneficio} onChange={(e)=>setForm({...form, imagen_beneficio: e.target.value})} placeholder="https://ejemplo.com/imagen.jpg" className="w-full p-3 bg-gray-50 border-2 border-gray-400 rounded-xl text-gray-900 text-sm font-medium shadow-inner focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all duration-200" />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">{editing ? (<><button onClick={handleUpdate} className="px-6 py-2 text-white rounded-full font-bold transition-all duration-300 hover:scale-105" style={{ background: 'linear-gradient(135deg, #16a34a, #14b8a6)' }}>Actualizar</button><button onClick={()=>{ setEditing(null); resetForm(); setIsModalOpen(false); }} className="px-6 py-2 rounded-full font-bold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-all duration-300">Cancelar</button></>) : (<button onClick={()=>{ handleCreate(); setIsModalOpen(false); }} className="px-6 py-2 text-white rounded-full font-bold transition-all duration-300 hover:scale-105" style={{ background: 'linear-gradient(135deg, #16a34a, #14b8a6)' }}>Crear Beneficio</button>)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GestionBeneficiosAdmin() {
  return (
    <AdminSidebarProvider>
      <div className="flex">
        <AdminSidebar />
        <AdminContent />
      </div>
    </AdminSidebarProvider>
  );
}
