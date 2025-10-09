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
      {/* Solid colored background similar to Home dark sections (no image) */}
      <div className="fixed inset-0 z-0" style={{ backgroundColor: '#1E1E1E' }} />

      <div className="relative z-10 min-h-screen pt-20 px-4 sm:px-6 lg:px-8 text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white" style={{ fontFamily: 'League Spartan, sans-serif', fontWeight: 800 }}>Gestión de Beneficios</h1>
          </header>

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
              <button onClick={fetchBeneficios} title="Recargar" className="flex items-center gap-2 px-3 py-2 font-semibold rounded shadow hover:brightness-95" style={{ backgroundColor: '#00BC4F', color: '#ffffff' }}><RefreshCw size={16} /> Recargar</button>
              <button onClick={()=>{ setEditing(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-3 py-2 font-semibold rounded shadow hover:brightness-95" style={{ backgroundColor: '#00BC4F', color: '#ffffff' }}><Plus size={16} /> Nuevo</button>
            </div>
          </div>

          <section>
            <div className="flex flex-col gap-4">
              {loading && <div className="text-center text-gray-200">Cargando beneficios...</div>}
              {!loading && beneficios.length === 0 && <div className="text-center text-gray-200">No hay beneficios</div>}

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
                  <article key={b.id} className="rounded-2xl overflow-hidden flex hover:shadow-xl transition" style={{ backgroundColor: '#0A0A0B' }}>
                    <div className="p-4 flex-1 flex items-start gap-4">
                      <div className="w-14 h-14 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0"><Star size={20} /></div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="text-left">
                            <h3 className="font-semibold text-lg text-white text-left">{b.titulo || 'Sin título'}</h3>
                            <div className="text-xs text-gray-300 text-left">{(b.tipo_beneficio || '').charAt(0).toUpperCase() + (b.tipo_beneficio || '').slice(1)}</div>
                            {b.empresa_asociada && <div className="text-xs text-green-300 text-left">{b.empresa_asociada}</div>}
                          </div>
                          <div className="text-xs text-gray-300 flex items-center gap-1">
                            <div className="p-1 bg-green-100 rounded-full">
                              <Calendar size={12} className="text-green-700" />
                            </div>
                            <span>{b.fecha_inicio || ''}{b.fecha_fin ? ` • ${b.fecha_fin}` : ''}</span>
                          </div>
                        </div>

                        <p className="mt-2 text-sm text-gray-300 line-clamp-3 text-left">{b.descripcion || '—'}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-2 p-3 min-h-full" style={{ backgroundColor: '#00BC4F' }}>
                      <button onClick={()=>{ handleEdit(b); setIsModalOpen(true); }} title="Editar" className="p-2 transition-colors" style={{ backgroundColor: 'transparent', border: 'none' }}>
                        <Edit2 size={16} className="text-white hover:text-gray-200" />
                      </button>
                      <button onClick={()=>handleDelete(b.id)} title="Eliminar" className="p-2 transition-colors" style={{ backgroundColor: 'transparent', border: 'none' }}>
                        <Trash size={16} className="text-white hover:text-gray-200" />
                      </button>
                    </div>
                  </article>
                ))}
            </div>
          </section>

          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="rounded-lg w-full max-w-4xl p-6 shadow-lg border border-gray-600 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#0A0A0B' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">{editing ? 'Editar beneficio' : 'Crear beneficio'}</h3>
                  <button onClick={()=>{ setIsModalOpen(false); setEditing(null); resetForm(); }} title="Cerrar" className="p-2 transition-colors" style={{ backgroundColor: 'transparent', border: 'none' }}>
                    <X size={18} className="text-green-600 hover:text-green-700" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-white text-xs font-medium mb-1 text-left">Título</label>
                      <input value={form.titulo} onChange={(e)=>setForm({...form, titulo: e.target.value})} className="w-full p-1.5 bg-black border-2 border-white rounded-full text-white text-xs" />
                    </div>
                    <div>
                      <label className="block text-white text-xs font-medium mb-1 text-left">Tipo de Beneficio</label>
                      <select value={form.tipo_beneficio} onChange={(e)=>setForm({...form, tipo_beneficio: e.target.value})} className="w-full p-1.5 bg-black border-2 border-white rounded-full text-white text-xs">
                        <option value="academico">Académico</option>
                        <option value="laboral">Laboral</option>
                        <option value="salud">Salud</option>
                        <option value="cultural">Cultural</option>
                        <option value="convenio">Convenio</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white text-xs font-medium mb-1 text-left">Estado</label>
                      <select value={form.estado} onChange={(e)=>setForm({...form, estado: e.target.value})} className="w-full p-1.5 bg-black border-2 border-white rounded-full text-white text-xs">
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-white text-xs font-medium mb-1 text-left">Descripción</label>
                    <textarea value={form.descripcion} onChange={(e)=>setForm({...form, descripcion: e.target.value})} className="w-full p-1.5 bg-black border-2 border-white rounded-2xl text-white text-xs h-16" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-white text-xs font-medium mb-1 text-left">Empresa Asociada</label>
                      <input value={form.empresa_asociada} onChange={(e)=>setForm({...form, empresa_asociada: e.target.value})} className="w-full p-1.5 bg-black border-2 border-white rounded-full text-white text-xs" />
                    </div>
                    <div>
                      <label className="block text-white text-xs font-medium mb-1 text-left">URL Detalle / Código de Descuento</label>
                      <input type="text" value={form.url_detalle} onChange={(e)=>setForm({...form, url_detalle: e.target.value})} placeholder="https://ejemplo.com o CODIGO20" className="w-full p-1.5 bg-black border-2 border-white rounded-full text-white text-xs" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-white text-xs font-medium mb-1 text-left">Fecha inicio</label>
                      <input type="date" value={form.fecha_inicio} onChange={(e)=>setForm({...form, fecha_inicio: e.target.value})} className="w-full p-1.5 bg-black border-2 border-white rounded-full text-white text-xs [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer" style={{ colorScheme: 'dark' }} />
                    </div>
                    <div>
                      <label className="block text-white text-xs font-medium mb-1 text-left">Fecha fin</label>
                      <input type="date" value={form.fecha_fin} onChange={(e)=>setForm({...form, fecha_fin: e.target.value})} className="w-full p-1.5 bg-black border-2 border-white rounded-full text-white text-xs [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer" style={{ colorScheme: 'dark' }} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white text-xs font-medium mb-1 text-left">Imagen del Beneficio (URL)</label>
                    <input type="url" value={form.imagen_beneficio} onChange={(e)=>setForm({...form, imagen_beneficio: e.target.value})} className="w-full p-1.5 bg-black border-2 border-white rounded-full text-white text-xs" />
                  </div>
                </div>

                <div className="mt-3 flex justify-end gap-2">{editing ? (<><button onClick={handleUpdate} className="px-3 py-1 text-white rounded text-sm" style={{ backgroundColor: '#00BC4F' }}>Actualizar</button><button onClick={()=>{ setEditing(null); resetForm(); setIsModalOpen(false); }} className="px-3 py-1 rounded text-sm" style={{ backgroundColor: '#6b7280', color: '#ffffff' }}>Cancelar</button></>) : (<button onClick={()=>{ handleCreate(); setIsModalOpen(false); }} className="px-3 py-1 text-white rounded text-sm" style={{ backgroundColor: '#00BC4F' }}>Crear</button>)}</div>
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
