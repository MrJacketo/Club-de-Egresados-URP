const NoticiasHeader = ({ user, error, onRetry }) => {
  //Componentes de alertas
  const AuthWarning = () => (
    <div
      className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-3 mx-auto max-w-2xl mb-4 backdrop-blur-sm"
      role="alert"
    >
      <p className="text-blue-100">🔒 Necesitas iniciar sesión para ver noticias actualizadas</p>
    </div>
  )

  const ErrorBanner = () => (
    <div
      className="bg-red-500/20 border border-red-400/50 rounded-lg p-3 mx-auto max-w-2xl mb-4 backdrop-blur-sm"
      role="alert"
    >
      <p className="text-red-100 mb-2">❌ {error}</p>
      <button
        onClick={onRetry}
        className="bg-white/90 text-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-white transition-colors"
        type="button"
      >
        Reintentar
      </button>
    </div>
  )

  //Render principal
  return (
    <header className="text-center mb-8">
      <div className="mb-4">
        <h1 className="text-5xl font-extrabold text-[#232b36] mb-2 tracking-wider" style={{ fontFamily: 'inherit', textShadow: 'none' }}>
          NOTICIAS
        </h1>
        <p className="text-xl text-[#232b36] font-normal" style={{ fontFamily: 'inherit', textShadow: 'none' }}>
          Eventos y Novedades
        </p>
      </div>

      {/* Alertas y estados */}
      <div>
        {!user && <AuthWarning />}
        {error && <ErrorBanner />}
      </div>
    </header>
  )
}

export default NoticiasHeader