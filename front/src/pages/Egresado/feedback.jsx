import FiltrosBeneficio from "../../components/feedback/FiltrosBeneficio"
import CardBeneficio from "../../components/feedback/CardBeneficio"
import FeedbackForm from "../../components/feedback/FeedbackForm"
import useFiltrosBeneficios from "../../hooks/useFiltrosBeneficios"

const FeedbackPage = () => {
  const { filtros, setFiltros, beneficiosFiltrados, resetFiltros } = useFiltrosBeneficios()

  const handleFeedbackSuccess = () => {
    // Reset filtros después de enviar feedback exitosamente
    resetFiltros()
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 pt-8 text-black">FEEDBACK DE BENEFICIOS</h1>

        <FiltrosBeneficio filtros={filtros} setFiltros={setFiltros} />

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            {beneficiosFiltrados.length > 0 ? (
              beneficiosFiltrados.map((beneficio) => <CardBeneficio key={beneficio.id} beneficio={beneficio} />)
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-md">
                <p className="text-lg font-bold text-black">
                  No se encontraron beneficios con los filtros seleccionados.
                </p>
              </div>
            )}
          </div>

          <div className="col-span-1">
            <FeedbackForm onSuccess={handleFeedbackSuccess} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedbackPage
