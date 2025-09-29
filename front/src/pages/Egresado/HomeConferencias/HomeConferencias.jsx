import { Link, useNavigate } from "react-router-dom";

const HomeConferencias = () => {
    return (
        <div className="bg-[#1C1D21] text-white font-family:league spartan" >
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-3">
                <div className="logo">
                </div>
            </header>

            {/* Contenido */}
            <div className="p-8">
                <h1 className="text-5xl font-bold">CONFERENCIAS URP</h1>
                <h2 className="text-3xl text-green-500 mt-3 mb-8">Eventos destacados</h2>

                <div className="flex gap-6 overflow-x-auto">
                    {/* Card 1 */}
                    <div className="bg-[#222] rounded-xl w-72 p-4">
                        <img src="img1.png" alt="Webinar" className="w-full rounded-lg" />
                        <p className="text-xs mt-3">Noviembre 28, 2024 - 6:30pm</p>
                        <h3 className="text-sm font-bold mt-2">
                            WEBINAR: Configuración de tablas y figuras en APA 7
                        </h3>
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-green-500 text-sm">Gratis</span>
                            <a href="#" className="bg-green-500 text-black px-4 py-1 rounded-3xl text-sm">
                                Inscribirte
                            </a>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-[#222] rounded-xl w-72 p-4">
                        <img src="img2.png" alt="Seminario" className="w-full rounded-lg" />
                        <p className="text-xs mt-3">Noviembre 26, 2024 - 7:30pm</p>
                        <h3 className="text-sm font-bold mt-2">
                            SEMINARIO de Defensa Nacional
                        </h3>
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-green-500 text-sm">Gratis</span>
                            <a href="#" className="bg-green-500 text-black px-4 py-1 rounded-3xl text-sm">
                                Inscribirte
                            </a>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-[#222] rounded-xl w-72 p-4">
                        <img src="img3.png" alt="Conferencia" className="w-full rounded-lg" />
                        <p className="text-xs mt-3">Noviembre 28, 2024 - 6:30pm</p>
                        <h3 className="text-sm font-bold mt-2">
                            CONFERENCIA: Impulsa tu carrera con bolsa de empleo
                        </h3>
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-green-500 text-sm">Gratis</span>
                            <a href="#" className="bg-green-500 text-black px-4 py-1 rounded-3xl text-sm">
                                Inscribirte
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeConferencias;


