import FiltrosBeneficio from "../../../components/feedback/FiltrosBeneficio";
import CardBeneficio from "../../../components/feedback/CardBeneficio";
import FeedbackForm from "../../../components/feedback/FeedbackForm";
import useFiltrosConferencias from "../../../Hooks/useFiltrosConferencias";
import FiltrosConferencia from "../../../components/feedback/FiltrosConferencias";

const HomeConferencias = () => {
    const { filtros, setFiltros, beneficiosFiltrados, resetFiltros } =
        useFiltrosConferencias()

    const handleFeedbackSuccess = () => {
        resetFiltros();
    };

    return (
        <div className="min-h-screen bg-theme-primary transition-theme">
            {/* Header con gradiente sutil */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 pt-20 pb-16">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-5xl font-bold text-white mb-3">
                        Conferencias
                    </h1>
                    <p className="text-emerald-50 text-lg">
                        Ven y participa de las conferencias que tenemos para ti
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-8">
                {/* Filtros en card flotante */}
                <div className="bg-theme-secondary rounded-2xl shadow-lg p-6 mb-8 border border-theme transition-theme">
                    <FiltrosConferencia filtros={filtros} setFiltros={setFiltros} />
                </div>

                {/* Título y botón limpiar filtros */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-theme-primary">
                        {beneficiosFiltrados.length}{" "}
                        {beneficiosFiltrados.length === 1 ? "Resultado" : "Resultados"}
                    </h2>
                    {Object.keys(filtros).length > 0 && (
                        <button
                            onClick={resetFiltros}
                            className="text-sm text-theme-accent hover:underline font-medium"
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>

                {/* Grid de 3 columnas */}
                {beneficiosFiltrados.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                        {beneficiosFiltrados.map((beneficio) => (
                            <CardBeneficio key={beneficio.id} beneficio={beneficio} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-theme-secondary rounded-2xl p-12 text-center border border-theme shadow-sm transition-theme mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                            <svg
                                className="w-8 h-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-theme-primary mb-2">
                            No se encontraron beneficios
                        </h3>
                        <p className="text-theme-secondary">
                            Intenta ajustar tus filtros para ver más resultados
                        </p>
                    </div>
                )}
            </div>
        </div>
    );

};

export default HomeConferencias;