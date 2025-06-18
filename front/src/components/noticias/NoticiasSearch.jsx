const NoticiasSearch = ({ searchTerm, onSearchChange, totalNoticias, filteredCount }) => {
  // Handlers
  const handleInputChange = (e) => {
    onSearchChange(e.target.value)
  }

  const handleClearSearch = () => {
    onSearchChange("")
  }

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      handleClearSearch()
    }
  }

  return (
    <section className="mb-8">
      <div className="max-w-lg mx-auto">
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" aria-hidden="true">
            🔍
          </span>
          <input
            type="text"
            placeholder="Buscar noticias por título, contenido o categoría..."
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full pl-12 pr-12 py-3 border-none rounded-xl text-gray-900 shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300/50 transition-all"
            aria-label="Buscar noticias"
            autoFocus // <-- Esto ayuda a mantener el foco
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors text-xs"
              title="Limpiar búsqueda (Esc)"
              type="button"
              aria-label="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {searchTerm && (
        <div className="text-center mt-4" role="status" aria-live="polite">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
            <p className="text-white/80 text-sm">
              Mostrando <strong>{filteredCount}</strong> de <strong>{totalNoticias}</strong> noticias para "
              <em>{searchTerm}</em>"
            </p>
          </div>
        </div>
      )}
    </section>
  )
}

export default NoticiasSearch