import { createContext, useState, useEffect, useContext } from "react";
import auth from "../auth";
import { getMembresiaRequest } from "../api/membresiaApi";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(() => {
    const userData = auth.getUser();
    // ✅ GUARDAR USUARIO COMPLETO EN LOCALSTORAGE INMEDIATAMENTE
    if (userData && userData.id) {
      localStorage.setItem('currentUser', JSON.stringify(userData));
    }
    return userData;
  });
  
  const [userName, setUserName] = useState(() => {
    const userData = auth.getUser();
    return userData?.name || "";
  });
  const [membresia, setMembresia] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch membership status
  const fetchMembresia = async () => {
    try {
      if (auth.isAuthenticated()) {
        const membresiaData = await getMembresiaRequest();
        setMembresia(membresiaData);
      }
    } catch (error) {
      console.error("Error fetching membresia:", error);
      setMembresia({ estado: "inactiva" });
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        if (auth.isAuthenticated()) {
          const currentUser = await auth.getCurrentUserSafe();
          
          // ✅ GUARDAR USUARIO COMPLETO CON ID EN LOCALSTORAGE
          if (currentUser && currentUser.id) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
          }
          
          setUser(currentUser);
          setUserName(currentUser.name);
          
          // Fetch membership status
          await fetchMembresia();
        } else {
          const localUser = auth.getUser();
          
          if (localUser && localUser.id) {
            // ✅ Asegurar que el usuario local tenga ID
            localStorage.setItem('currentUser', JSON.stringify(localUser));
            setUser(localUser);
            setUserName(localUser.name);
            // Try to fetch membership even with local user
            await fetchMembresia();
          } else {
            setUser(null);
            setUserName("");
            setMembresia(null);
            localStorage.removeItem('currentUser');
          }
        }
      } catch (error) {
        console.log("⚠️ Error en autenticación, usando datos locales:", error);
        const localUser = auth.getUser();
        if (localUser && localUser.id) {
          localStorage.setItem('currentUser', JSON.stringify(localUser));
          setUser(localUser);
          setUserName(localUser.name);
          // Try to fetch membership
          await fetchMembresia();
        } else {
          setUser(null);
          setUserName("");
          setMembresia(null);
          localStorage.removeItem('currentUser');
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await auth.login(email, password);
      
      // ✅ VERIFICAR QUE EL USUARIO TENGA ID
      if (response.user && response.user.id) {
        // ✅ GUARDAR USUARIO COMPLETO CON ID EN LOCALSTORAGE
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        
        setUser(response.user);
        setUserName(response.user.name);
        
        // ✅ DISPARAR EVENTO PARA ACTUALIZAR OTROS COMPONENTES
        window.dispatchEvent(new Event('userLoggedIn'));
      } else {
        console.error('❌ Usuario sin ID después del login:', response.user);
        throw new Error('Usuario no tiene ID válido');
      }
      
      
      // Fetch membership status after login
      await fetchMembresia();
      
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await auth.register(name, email, password);
      
      // ✅ VERIFICAR QUE EL USUARIO TENGA ID
      if (response.user && response.user.id) {
        // ✅ GUARDAR USUARIO COMPLETO CON ID EN LOCALSTORAGE
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        
        setUser(response.user);
        setUserName(response.user.name);
        
        // ✅ DISPARAR EVENTO PARA ACTUALIZAR OTROS COMPONENTES
        window.dispatchEvent(new Event('userRegistered'));
      } else {
        console.error('❌ Usuario sin ID después del registro:', response.user);
        throw new Error('Usuario no tiene ID válido');
      }
      
      
      // Fetch membership status after registration (will be inactive)
      await fetchMembresia();
      
      return response;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const logout = () => {
    auth.logout();
    setUser(null);
    setUserName("");
    
    // ✅ LIMPIAR TODOS LOS DATOS DEL USUARIO AL CERRAR SESIÓN
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        const userId = userData.id || userData._id;
        
        if (userId) {
          // Limpiar datos específicos del usuario
          localStorage.removeItem(`academicData_${userId}`);
          localStorage.removeItem(`userProfilePhoto_${userId}`);
        }
      } catch (error) {
        console.error('Error limpiando datos de usuario:', error);
      }
    }
    
    // Limpiar datos generales
    localStorage.removeItem('currentUser');
    localStorage.removeItem('academicData');
    localStorage.removeItem('userProfilePhoto');
    
    // ✅ DISPARAR EVENTO PARA ACTUALIZAR OTROS COMPONENTES
    window.dispatchEvent(new Event('userLoggedOut'));
  };

  // ✅ FUNCIÓN PARA OBTENER EL ID DEL USUARIO ACTUAL
  const getUserId = () => {
    if (user && user.id) {
      return user.id;
    }
    
    // Intentar obtener del localStorage como fallback
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        return userData.id || userData._id || null;
      }
    } catch (error) {
      console.error('Error obteniendo ID del usuario:', error);
    }
    
    return null;
  };

  // ✅ FUNCIÓN PARA ACTUALIZAR DATOS DEL USUARIO
  const updateUserData = (newUserData) => {
    if (newUserData && newUserData.id) {
      localStorage.setItem('currentUser', JSON.stringify(newUserData));
      setUser(newUserData);
      setUserName(newUserData.name);
      window.dispatchEvent(new Event('userDataUpdated'));
    }
    setMembresia(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        userName,
        membresia,
        setUser,
        login,
        register,
        logout,
        loading,
        fetchMembresia,
        isAuthenticated: auth.isAuthenticated(),
        getUserId,
        updateUserData,
        isMembresiaActiva: membresia?.estado === "activa",
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the UserContext
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
}