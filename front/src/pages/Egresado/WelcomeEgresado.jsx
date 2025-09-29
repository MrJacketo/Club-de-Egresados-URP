import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import { Link } from "react-router-dom";
import { User, Home, Briefcase, Newspaper, MessageCircle, Globe, Star, Calendar, Award, Users } from "lucide-react";
import apiClient from "../../api/apiClient"; // Axios instance to fetch user data

export default function Dashboard() {
  const { user, userName } = useContext(UserContext); // JWT user from context
  const [userDisplayName, setUserDisplayName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        try {
          // First try to use userName from context
          if (userName) {
            setUserDisplayName(userName);
          } else {
            // Fallback: Fetch the user's name from the backend
            const response = await apiClient.get("/auth/user-name");
            setUserDisplayName(response.data.name);
          }
        } catch (error) {
          console.error("Error fetching user name:", error);
          // Fallback to user name from JWT user object
          setUserDisplayName(user?.name || "Usuario");
        }
      }
    };

    fetchUserName();
  }, [user, userName]);

  // Mock data for the news portal
  const featuredNews = {
    title: "Nuevos Proyectos Arquitectónicos URP 2024",
    summary: "La Universidad Ricardo Palma presenta sus innovadores proyectos de investigación en arquitectura sostenible que transformarán el paisaje urbano.",
    image: "/entradaurp.jpg",
    category: "Proyectos",
    date: "15 de Enero, 2024"
  };

  const gridNews = [
    {
      id: 1,
      title: "Beca de Excelencia Académica 2024",
      summary: "Convocatoria abierta para egresados destacados que deseen continuar estudios de posgrado.",
      image: "/beneficiosurpex.png",
      category: "Becas",
      date: "12 de Enero, 2024"
    },
    {
      id: 2,
      title: "Foro de Empleabilidad URP",
      summary: "Conecta con las mejores empresas del país en nuestro evento anual de networking profesional.",
      image: "/beneficio.png",
      category: "Eventos",
      date: "10 de Enero, 2024"
    },
    {
      id: 3,
      title: "Certificación Internacional",
      summary: "Nuevos cursos de especialización con certificación internacional disponibles para egresados.",
      image: "/logo.png",
      category: "Educación",
      date: "8 de Enero, 2024"
    }
  ];

  const popularNews = [
    {
      id: 4,
      title: "Programa de Mentores URP",
      summary: "Egresados experimentados comparten conocimientos con nuevas generaciones.",
      category: "Mentores",
      date: "5 de Enero, 2024"
    },
    {
      id: 5,
      title: "Convenio con Microsoft",
      summary: "Acceso gratuito a herramientas tecnológicas para todos los egresados registrados.",
      category: "Tecnología",
      date: "3 de Enero, 2024"
    },
    {
      id: 6,
      title: "Red de Alumni Internacional",
      summary: "Conecta con egresados URP alrededor del mundo a través de nuestra nueva plataforma.",
      category: "Networking",
      date: "1 de Enero, 2024"
    }
  ];

  const destacados = [
    {
      title: "Membresía Premium",
      description: "Accede a beneficios exclusivos",
      link: "/VerMembresia"
    },
    {
      title: "Bolsa de Trabajo",
      description: "Oportunidades laborales exclusivas",
      link: "/VerTodosBeneficios"
    },
    {
      title: "Mi Perfil",
      description: "Actualiza tu información profesional",
      link: "/perfil-egresado-form"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top bar with logo and user info */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <img src="/logo.png" alt="Logo URP" className="w-10 h-10" />
              <h1 className="text-xl font-bold text-gray-900">Portal Egresados URP</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  ¡Hola, {userDisplayName || "Usuario"}!
                </span>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex space-x-8 border-t border-gray-200 pt-4 pb-4">
            <Link to="/welcome-egresado" className="flex items-center space-x-2 text-green-600 font-medium border-b-2 border-green-600 pb-2">
              <Home className="w-4 h-4" />
              <span>Inicio</span>
            </Link>
            <Link to="/VerTodosBeneficios" className="flex items-center space-x-2 text-gray-600 hover:text-green-600 pb-2">
              <Briefcase className="w-4 h-4" />
              <span>Ofertas</span>
            </Link>
            <Link to="#" className="flex items-center space-x-2 text-gray-600 hover:text-green-600 pb-2">
              <Newspaper className="w-4 h-4" />
              <span>Noticias</span>
            </Link>
            <Link to="#" className="flex items-center space-x-2 text-gray-600 hover:text-green-600 pb-2">
              <MessageCircle className="w-4 h-4" />
              <span>Foro</span>
            </Link>
            <Link to="#" className="flex items-center space-x-2 text-gray-600 hover:text-green-600 pb-2">
              <Globe className="w-4 h-4" />
              <span>Intranet</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Main Content */}
          <div className="flex-1">
            {/* Hero Section */}
            <div className="mb-8">
              <div className="relative bg-white rounded-xl shadow-md overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 sm:aspect-h-6">
                  <img 
                    src={featuredNews.image} 
                    alt={featuredNews.title}
                    className="w-full h-64 sm:h-80 object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-3 py-1 bg-green-500 text-xs font-semibold rounded-full">
                      {featuredNews.category}
                    </span>
                    <span className="text-sm opacity-90">{featuredNews.date}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">{featuredNews.title}</h2>
                  <p className="text-sm sm:text-base opacity-90 max-w-2xl">{featuredNews.summary}</p>
                </div>
              </div>
            </div>

            {/* Featured Articles Grid */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Artículos Destacados</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {gridNews.map((article) => (
                  <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-w-16 aspect-h-10">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-40 object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                          {article.category}
                        </span>
                        <span className="text-xs text-gray-500">{article.date}</span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">{article.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{article.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Articles */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Artículos Populares</h3>
              <div className="space-y-4">
                {popularNews.map((article) => (
                  <div key={article.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                            {article.category}
                          </span>
                          <span className="text-xs text-gray-500">{article.date}</span>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">{article.title}</h4>
                        <p className="text-sm text-gray-600">{article.summary}</p>
                      </div>
                      <Star className="w-4 h-4 text-yellow-500 ml-4 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 text-yellow-500 mr-2" />
                DESTACADOS
              </h3>
              <div className="space-y-4">
                {destacados.map((item, index) => (
                  <Link
                    key={index}
                    to={item.link}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                  >
                    <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </Link>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Tu Actividad</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Beneficios activos</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-600">Conexiones</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">28</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-gray-600">Eventos próximos</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
