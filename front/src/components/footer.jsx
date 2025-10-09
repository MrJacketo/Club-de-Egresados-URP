
import logo from "../assets/logo3.svg";
const Footer = () => {
    return (
    
      <div className="w-full h-16 mt-16 bg-[#01a83c]! flex justify-center gap-3 items-center">
         <p className="font-bold">
            Todos los derechos reservados URPex
         </p>
         <img className="h-4" src={logo} alt="Logo InnovaUrp" />
      </div>
    )
}
export default Footer