import React, { useState, useEffect, useMemo } from "react";
import {
  Work,
  Group,
  Assignment,
  Search,
  FileDownload,
  Add,
  TrendingUp,
  VerifiedUser,
  Edit,
  Delete,
  ToggleOff,
  ToggleOn,
  Visibility,
  Close,
  Email,
  Phone,
  AttachFile,
  CalendarToday,
  Person,
} from "@mui/icons-material";
import AdminSidebar from "../../components/AdminSidebar";
import {
  AdminSidebarProvider,
  useAdminSidebar,
} from "../../context/adminSidebarContext";
import {
  getOfertasRequest,
  createOrUpdateOfertaRequest,
  getOfertaRequest,
  deleteOfertaRequest,
  disableOfertaRequest,
  getPostulantesDeOfertaRequest,
} from "../../api/ofertaLaboralApi";
import {
  AREAS_LABORALES,
  MODALIDAD,
  REQUISITOS,
  TIPOS_CONTRATO,
} from "../../constants/OfertaLaboral/OfertaLaboral.enum";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ofertaLaboralSchema } from "../../constants/OfertaLaboral/OfertaLaboralSchema";

const AdminOfertas = () => {
  return (
    <AdminSidebarProvider>
      <AdminOfertasContent />
    </AdminSidebarProvider>
  );
};

const AdminOfertasContent = () => {
  const { collapsed } = useAdminSidebar();

  const [ofertas, setOfertas] = useState([]);
  const [totalOfertas, setTotalOfertas] = useState(0);
  const [ofertasActivas, setOfertasActivas] = useState(0);
  const [totalPostulantes, setTotalPostulantes] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterArea, setFilterArea] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const [showCreateEditModal, setShowCreateEditModal] = useState(false);
  const [showPostulantesModal, setShowPostulantesModal] = useState(false);
  const [currentOferta, setCurrentOferta] = useState(null);
  const [postulantes, setPostulantes] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(ofertaLaboralSchema),
  });

  const fetchOfertas = async () => {
    try {
      setLoading(true);
      const data = await getOfertasRequest();
      setOfertas(data);
      setTotalOfertas(data.length);
      setOfertasActivas(data.filter((o) => o.activo).length);
      const totalPost = data.reduce((sum, o) => sum + (o.postulantes || 0), 0);
      setTotalPostulantes(totalPost);
    } catch (error) {
      console.error("Error al obtener ofertas:", error);
      toast.error("Error al cargar las ofertas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfertas();
  }, []);

  const filteredOfertas = useMemo(() => {
    return ofertas.filter((oferta) => {
      const matchSearch =
        oferta.cargo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        oferta.empresa?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterStatus
        ? filterStatus === "active"
          ? oferta.activo
          : !oferta.activo
        : true;
      const matchArea = filterArea ? oferta.area === filterArea : true;
      return matchSearch && matchStatus && matchArea;
    });
  }, [ofertas, searchTerm, filterStatus, filterArea]);

  const sortedOfertas = useMemo(() => {
    const sorted = [...filteredOfertas];
    switch (sortBy) {
      case "cargo":
        return sorted.sort((a, b) => a.cargo.localeCompare(b.cargo));
      case "recent":
        return sorted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "oldest":
        return sorted.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      case "postulantes":
        return sorted.sort((a, b) => (b.postulantes || 0) - (a.postulantes || 0));
      default:
        return sorted;
    }
  }, [filteredOfertas, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("");
    setFilterArea("");
    setSortBy("recent");
  };

  const handleCreateOferta = () => {
    setCurrentOferta(null);
    reset({
      cargo: "",
      empresa: "",
      modalidad: "",
      ubicacion: "",
      tipoContrato: "",
      requisitos: "",
      descripcion: "",
      area: "",
      linkEmpresa: "",
      salario: "",
      fechaCierre: "",
    });
    setShowCreateEditModal(true);
  };

  const handleEditOferta = async (oferta) => {
    try {
      setLoading(true);
      const data = await getOfertaRequest(oferta.id || oferta._id);
      setCurrentOferta(data);
      
      const normalizedData = {
        cargo: data.cargo || "",
        empresa: data.empresa || "",
        modalidad: data.modalidad || "",
        ubicacion: data.ubicacion || "",
        tipoContrato: data.tipoContrato || "",
        requisitos: data.requisitos || "",
        descripcion: data.descripcion || "",
        area: data.area || "",
        linkEmpresa: data.linkEmpresa || "",
        salario: data.salario || "",
        fechaCierre: data.fechaCierre ? data.fechaCierre.slice(0, 10) : "",
      };
      
      reset(normalizedData);
      setShowCreateEditModal(true);
    } catch (error) {
      console.error("Error al cargar oferta:", error);
      toast.error("Error al cargar la oferta");
    } finally {
      setLoading(false);
    }
  };

  const handleViewPostulantes = async (oferta) => {
    try {
      setLoading(true);
      setCurrentOferta(oferta);
      const data = await getPostulantesDeOfertaRequest(oferta.id || oferta._id);
      setPostulantes(data || []);
      setShowPostulantesModal(true);
    } catch (error) {
      console.error("Error al cargar postulantes:", error);
      toast.error("Error al cargar postulantes");
      setPostulantes([]);
      setShowPostulantesModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (oferta) => {
    try {
      await disableOfertaRequest(oferta.id || oferta._id);
      toast.success(
        oferta.activo
          ? "Oferta desactivada exitosamente"
          : "Oferta activada exitosamente"
      );
      fetchOfertas();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      toast.error("Error al cambiar el estado de la oferta");
    }
  };

  const handleDeleteOferta = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta oferta?")) {
      try {
        await deleteOfertaRequest(id);
        toast.success("Oferta eliminada exitosamente");
        fetchOfertas();
      } catch (error) {
        console.error("Error al eliminar oferta:", error);
        toast.error("Error al eliminar la oferta");
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const ofertaData = {
        ...data,
        fechaCierre: new Date(data.fechaCierre),
      };

      if (currentOferta) {
        ofertaData.id = currentOferta.id || currentOferta._id;
      }

      await createOrUpdateOfertaRequest(ofertaData);
      
      toast.success(
        currentOferta
          ? "Oferta actualizada exitosamente"
          : "Oferta creada exitosamente"
      );
      
      setShowCreateEditModal(false);
      fetchOfertas();
    } catch (error) {
      console.error("Error al guardar oferta:", error);
      toast.error("Error al guardar la oferta");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    console.log("Exportando ofertas a CSV...");
    toast.success("Funcionalidad en desarrollo");
  };

  const growthRate = totalOfertas > 0 ? ((ofertasActivas / totalOfertas) * 100).toFixed(1) : 0;
  const avgPostulantes = totalOfertas > 0 ? (totalPostulantes / totalOfertas).toFixed(1) : 0;

  return (
    <div
      className="flex min-h-screen pt-12"
      style={{ background: "linear-gradient(to bottom right, #f9fafb, #ffffff)" }}
    >
      <AdminSidebar />
      <div
        className={`flex-1 transition-all duration-300 px-8 py-8 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        <div className="mb-8">
          <h1 className="text-5xl text-start font-bold mb-2">
            <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
              Gestión de Ofertas Laborales
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-xl">
                <Work style={{ fontSize: 32, color: "#fff" }} />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp style={{ fontSize: 20 }} />
                <span className="text-sm font-bold">100%</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Total Ofertas</p>
            <p className="text-4xl font-bold text-gray-800">{totalOfertas}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-4 rounded-xl">
                <VerifiedUser style={{ fontSize: 32, color: "#16a34a" }} />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp style={{ fontSize: 20 }} />
                <span className="text-sm font-bold">{growthRate}%</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Ofertas Activas</p>
            <p className="text-4xl font-bold text-gray-800">{ofertasActivas}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-teal-100 p-4 rounded-xl">
                <Group style={{ fontSize: 32, color: "#14b8a6" }} />
              </div>
              <div className="flex items-center gap-1 text-teal-600">
                <TrendingUp style={{ fontSize: 20 }} />
                <span className="text-sm font-bold">85%</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Total Postulantes</p>
            <p className="text-4xl font-bold text-gray-800">{totalPostulantes}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-4 rounded-xl">
                <Assignment style={{ fontSize: 32, color: "#3b82f6" }} />
              </div>
              <div className="flex items-center gap-1 text-blue-600">
                <TrendingUp style={{ fontSize: 20 }} />
                <span className="text-sm font-bold">95%</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Promedio Postulantes</p>
            <p className="text-4xl font-bold text-gray-800">{avgPostulantes}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative group">
              <input
                type="text"
                placeholder="Buscar por cargo, empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 text-gray-800 px-6 py-4 pl-14 rounded-xl transition-all duration-300 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white focus:shadow-lg"
                style={{ outline: "none" }}
              />
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-green-500 transition-transform duration-300 group-hover:scale-110"
                style={{ fontSize: 24 }}
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-50 text-gray-800 px-6 py-4 pr-12 rounded-xl cursor-pointer transition-all duration-300 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white focus:shadow-lg appearance-none min-w-[180px]"
              style={{ outline: "none" }}
            >
              <option value="">Todos los estados</option>
              <option value="active">Activas</option>
              <option value="inactive">Inactivas</option>
            </select>

            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="bg-gray-50 text-gray-800 px-6 py-4 pr-12 rounded-xl cursor-pointer transition-all duration-300 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white focus:shadow-lg appearance-none min-w-[180px]"
              style={{ outline: "none" }}
            >
              <option value="">Todas las áreas</option>
              {AREAS_LABORALES.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-50 text-gray-800 px-6 py-4 pr-12 rounded-xl cursor-pointer transition-all duration-300 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white focus:shadow-lg appearance-none min-w-[180px]"
              style={{ outline: "none" }}
            >
              <option value="recent">Más recientes</option>
              <option value="oldest">Más antiguos</option>
              <option value="cargo">Por cargo</option>
              <option value="postulantes">Por postulantes</option>
            </select>

            <div className="flex gap-2">
              {(searchTerm || filterStatus || filterArea || sortBy !== "recent") && (
                <button
                  onClick={clearFilters}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-lg whitespace-nowrap"
                >
                  Limpiar
                </button>
              )}

              <button
                onClick={exportToCSV}
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center gap-2 whitespace-nowrap"
              >
                <FileDownload style={{ fontSize: 20 }} />
                Exportar
              </button>

              <button
                onClick={handleCreateOferta}
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center gap-2 whitespace-nowrap"
              >
                <Add style={{ fontSize: 20 }} />
                Nueva Oferta
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold">Cargo</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Empresa</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Área</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Modalidad</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Postulantes</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Estado</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sortedOfertas.map((oferta, index) => (
                  <tr
                    key={oferta.id || oferta._id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        
                        <div>
                          <p className="font-bold text-gray-800">{oferta.cargo}</p>
                          <p className="text-sm text-gray-500">{oferta.ubicacion}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-800 font-medium">{oferta.empresa}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {oferta.area}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          oferta.modalidad === "Remoto"
                            ? "bg-purple-100 text-purple-700"
                            : oferta.modalidad === "Híbrido"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {oferta.modalidad}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Group style={{ fontSize: 20, color: "#14b8a6" }} />
                        <span className="font-bold text-teal-600">
                          {oferta.postulantes || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {oferta.activo ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold flex items-center gap-1 w-fit">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Activo
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold flex items-center gap-1 w-fit">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewPostulantes(oferta)}
                          className="bg-blue-100! hover:bg-blue-200! text-blue-700! p-2! rounded-lg! transition-all! duration-300! hover:scale-110!"
                          title="Ver postulantes"
                        >
                          <Visibility style={{ fontSize: 20 }} />
                        </button>
                        <button
                          onClick={() => handleEditOferta(oferta)}
                          className="bg-green-100! hover:bg-green-200! text-green-700! p-2! rounded-lg! transition-all! duration-300! hover:scale-110!"
                          title="Editar"
                        >
                          <Edit style={{ fontSize: 20 }} />
                        </button>
                        <button
                          onClick={() => handleToggleActive(oferta)}
                          className={`${
                            oferta.activo
                              ? "bg-yellow-100! hover:bg-yellow-200! text-yellow-700!"
                              : "bg-green-100! hover:bg-green-200! text-green-700!"
                          } p-2! rounded-lg! transition-all! duration-300! hover:scale-110!`}
                          title={oferta.activo ? "Desactivar" : "Activar"}
                        >
                          {oferta.activo ? (
                            <ToggleOff style={{ fontSize: 20 }} />
                          ) : (
                            <ToggleOn style={{ fontSize: 20 }} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteOferta(oferta.id || oferta._id)}
                          className="bg-red-100! hover:bg-red-200! text-red-700! p-2! rounded-lg! transition-all! duration-300! hover:scale-110!"
                          title="Eliminar"
                        >
                          <Delete style={{ fontSize: 20 }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedOfertas.length === 0 && (
            <div className="text-center py-12">
              <Work style={{ fontSize: 64, color: "#d1d5db", marginBottom: 16 }} />
              <p className="text-gray-500 text-lg">No se encontraron ofertas</p>
            </div>
          )}
        </div>
      </div>

      {showCreateEditModal && (
        <div className="fixed! inset-0!  backdrop-blur-sm! bg-black/20! flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
            <div className="sticky top-0 bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-2xl font-bold">
                {currentOferta ? "Editar Oferta" : "Nueva Oferta"}
              </h2>
              <button
                onClick={() => setShowCreateEditModal(false)}
                className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
              >
                <Close style={{ fontSize: 24 }} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 max-h-[calc(90vh-100px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Título del empleo
                  </label>
                  <input
                    type="text"
                    {...register("cargo")}
                    className="w-full! px-4! py-3! text-black!  text-black! border-2! border-gray-300! rounded-xl! focus:border-green-500! transition-all!"
                    style={{ outline: "none" }}
                    placeholder="Ej: Desarrollador Full Stack"
                  />
                  {errors.cargo && (
                    <p className="text-red-500 text-sm mt-1">{errors.cargo.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Nombre Empresa
                  </label>
                  <input
                    type="text"
                    {...register("empresa")}
                    className="w-full px-4 py-3! text-black!  border-2 border-gray-300 rounded-xl focus:border-green-500 transition-all"
                    style={{ outline: "none" }}
                    placeholder="Ej: Tech Solutions SAC"
                  />
                  {errors.empresa && (
                    <p className="text-red-500 text-sm mt-1">{errors.empresa.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Modalidad de empleo
                  </label>
                  <select
                    {...register("modalidad")}
                    className="w-full px-4 py-3! text-black!  border-2 border-gray-300 rounded-xl focus:border-green-500 transition-all cursor-pointer"
                    style={{ outline: "none" }}
                  >
                    <option value="">Seleccionar modalidad</option>
                    {MODALIDAD.map((mod) => (
                      <option key={mod} value={mod}>
                        {mod}
                      </option>
                    ))}
                  </select>
                  {errors.modalidad && (
                    <p className="text-red-500 text-sm mt-1">{errors.modalidad.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Ubicación del empleo
                  </label>
                  <input
                    type="text"
                    {...register("ubicacion")}
                    className="w-full px-4 py-3! text-black!  border-2 border-gray-300 rounded-xl focus:border-green-500 transition-all"
                    style={{ outline: "none" }}
                    placeholder="Ej: Lima, Perú"
                  />
                  {errors.ubicacion && (
                    <p className="text-red-500 text-sm mt-1">{errors.ubicacion.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Tipo de contrato
                  </label>
                  <select
                    {...register("tipoContrato")}
                    className="w-full px-4 py-3! text-black!  border-2 border-gray-300 rounded-xl focus:border-green-500 transition-all cursor-pointer"
                    style={{ outline: "none" }}
                  >
                    <option value="">Seleccionar tipo</option>
                    {TIPOS_CONTRATO.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                  {errors.tipoContrato && (
                    <p className="text-red-500 text-sm mt-1">{errors.tipoContrato.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Experiencia laboral
                  </label>
                  <select
                    {...register("requisitos")}
                    className="w-full px-4 py-3! text-black!  border-2 border-gray-300 rounded-xl focus:border-green-500 transition-all cursor-pointer"
                    style={{ outline: "none" }}
                  >
                    <option value="">Seleccionar experiencia</option>
                    {REQUISITOS.map((req) => (
                      <option key={req} value={req}>
                        {req}
                      </option>
                    ))}
                  </select>
                  {errors.requisitos && (
                    <p className="text-red-500 text-sm mt-1">{errors.requisitos.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Descripción
                </label>
                <textarea
                  {...register("descripcion")}
                  rows={4}
                  className="w-full px-4 py-3! text-black!  border-2 border-gray-300 rounded-xl focus:border-green-500 transition-all resize-none"
                  style={{ outline: "none" }}
                  placeholder="Descripción detallada del puesto..."
                />
                {errors.descripcion && (
                  <p className="text-red-500 text-sm mt-1">{errors.descripcion.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Área de empleo
                  </label>
                  <select
                    {...register("area")}
                    className="w-full px-4 py-3! text-black!  border-2 border-gray-300 rounded-xl focus:border-green-500 transition-all cursor-pointer"
                    style={{ outline: "none" }}
                  >
                    <option value="">Seleccionar área</option>
                    {AREAS_LABORALES.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                  {errors.area && (
                    <p className="text-red-500 text-sm mt-1">{errors.area.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Sitio/Correo de la empresa
                  </label>
                  <input
                    type="text"
                    {...register("linkEmpresa")}
                    className="w-full px-4 py-3! text-black!  border-2 border-gray-300 rounded-xl focus:border-green-500 transition-all"
                    style={{ outline: "none" }}
                    placeholder="Ej: www.empresa.com"
                  />
                  {errors.linkEmpresa && (
                    <p className="text-red-500 text-sm mt-1">{errors.linkEmpresa.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Salario estimado
                  </label>
                  <input
                    type="text"
                    {...register("salario")}
                    className="w-full px-4 py-3! text-black!  border-2 border-gray-300 rounded-xl focus:border-green-500 transition-all"
                    style={{ outline: "none" }}
                    placeholder="Ej: S/. 5000 - 7000"
                  />
                  {errors.salario && (
                    <p className="text-red-500 text-sm mt-1">{errors.salario.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Fecha cierre de la oferta
                  </label>
                  <input
                    type="date"
                    {...register("fechaCierre")}
                    className="w-full px-4 py-3! text-black!  border-2 border-gray-300 rounded-xl focus:border-green-500 transition-all"
                    style={{ outline: "none" }}
                  />
                  {errors.fechaCierre && (
                    <p className="text-red-500 text-sm mt-1">{errors.fechaCierre.message}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4 sticky bottom-0 bg-white pb-4">
                <button
                  type="button"
                  onClick={() => setShowCreateEditModal(false)}
                  className="flex-1 bg-gray-100! hover:bg-gray-200 text-gray-700 py-3! text-black!  px-6 rounded-xl! font-bold! transition-all! duration-300!"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white! py-3!   px-6 rounded-xl font-bold transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Guardando..." : currentOferta ? "Actualizar Oferta" : "Crear Oferta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPostulantesModal && (
        <div className="fixed inset-0  backdrop-blur-sm! bg-black/20! flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-8">
            <div className="sticky top-0 bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 flex items-center justify-between rounded-t-2xl z-10">
              <div>
                <h2 className="text-2xl font-bold">Postulantes</h2>
                <p className="text-green-100 mt-1">
                  {currentOferta?.cargo} - {currentOferta?.empresa}
                </p>
              </div>
              <button
                onClick={() => setShowPostulantesModal(false)}
                className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
              >
                <Close style={{ fontSize: 24 }} />
              </button>
            </div>

            <div className="p-6 max-h-[calc(90vh-100px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500 p-3 rounded-lg">
                      <Group style={{ fontSize: 24, color: "#fff" }} />
                    </div>
                    <div>
                      <p className="text-blue-600 text-sm font-medium">
                        Total Postulantes
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        {postulantes.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500 p-3 rounded-lg">
                      <CalendarToday style={{ fontSize: 24, color: "#fff" }} />
                    </div>
                    <div>
                      <p className="text-green-600 text-sm font-medium">
                        Última postulación
                      </p>
                      <p className="text-lg font-bold text-green-900">
                        {postulantes.length > 0 ? "Reciente" : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-500 p-3 rounded-lg">
                      <AttachFile style={{ fontSize: 24, color: "#fff" }} />
                    </div>
                    <div>
                      <p className="text-purple-600 text-sm font-medium">
                        CVs recibidos
                      </p>
                      <p className="text-2xl font-bold text-purple-900">
                        {postulantes.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {postulantes.map((postulante, index) => (
                  <div
                    key={postulante.id || postulante._id || index}
                    className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-green-200"
                  >
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                          {postulante.nombre
                            ? postulante.nombre
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                            : "N/A"}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-bold text-gray-800">
                              {postulante.nombre || "Sin nombre"}
                            </h3>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                              #{index + 1}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Email style={{ fontSize: 18, color: "#14b8a6" }} />
                              <span className="text-sm">{postulante.correo || postulante.email || "Sin email"}</span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone style={{ fontSize: 18, color: "#14b8a6" }} />
                              <span className="text-sm">{postulante.numero || postulante.telefono || "Sin teléfono"}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <CalendarToday style={{ fontSize: 16 }} />
                            <span>
                              Postulado el{" "}
                              {postulante.fechaPostulacion
                                ? new Date(postulante.fechaPostulacion).toLocaleDateString("es-ES", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })
                                : "Fecha no disponible"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {postulante.cv && (
                          <button
                            onClick={() => {
                              if (postulante.cv) {
                                window.open(postulante.cv, "_blank");
                              } else {
                                toast.error("CV no disponible");
                              }
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold transition-all duration-300 hover:shadow-lg flex items-center gap-2"
                          >
                            <AttachFile style={{ fontSize: 18 }} />
                            Ver CV
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const email = postulante.correo || postulante.email;
                            if (email) {
                              window.location.href = `mailto:${email}`;
                            } else {
                              toast.error("Email no disponible");
                            }
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold transition-all duration-300 hover:shadow-lg flex items-center gap-2"
                        >
                          <Email style={{ fontSize: 18 }} />
                          Contactar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {postulantes.length === 0 && (
                <div className="text-center py-12">
                  <Person
                    style={{
                      fontSize: 64,
                      color: "#d1d5db",
                      marginBottom: 16,
                    }}
                  />
                  <p className="text-gray-500 text-lg">
                    Aún no hay postulantes para esta oferta
                  </p>
                </div>
              )}

              <div className="mt-6 sticky bottom-0 bg-white pt-4">
                <button
                  onClick={() => setShowPostulantesModal(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3! text-black!  px-6 rounded-xl font-bold transition-all duration-300"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOfertas;