import { createContext, useState, useEffect, useContext } from "react";
import auth from "../auth";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(() => {
    const userData = auth.getUser();
    // ✅ GUARDAR USUARIO COMPLETO EN LOCALSTORAGE INMEDIATAMENTE
    if (userData && userData.id) {
      localStorage.setItem('currentUser', JSON.stringify(userData));
      console.log('Usuario guardado en contexto:', userData); // Para debug
    }
    return userData;
  });
  
  const [userName, setUserName] = useState(() => {
    const userData = auth.getUser();
    return userData?.name || "";
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        console.log('🔄 Inicializando autenticación...'); // Para debug
        
        if (auth.isAuthenticated()) {
          const currentUser = await auth.getCurrentUserSafe();
          console.log('✅ Usuario autenticado:', currentUser); // Para debug
          
          // ✅ GUARDAR USUARIO COMPLETO CON ID EN LOCALSTORAGE
          if (currentUser && currentUser.id) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            console.log('✅ Usuario guardado en localStorage:', currentUser); // Para debug
          }
          
          setUser(currentUser);
          setUserName(currentUser.name);
        } else {
          const localUser = auth.getUser();
          console.log('🔍 Usuario local encontrado:', localUser); // Para debug
          
          if (localUser && localUser.id) {
            // ✅ Asegurar que el usuario local tenga ID
            localStorage.setItem('currentUser', JSON.stringify(localUser));
            setUser(localUser);
            setUserName(localUser.name);
          } else {
            console.log('❌ No hay usuario autenticado'); // Para debug
            setUser(null);
            setUserName("");
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
        } else {
          setUser(null);
          setUserName("");
          localStorage.removeItem('currentUser');
        }
      } finally {
        setLoading(false);
        console.log('🏁 Inicialización completada'); // Para debug
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 Iniciando sesión...'); // Para debug
      const response = await auth.login(email, password);
      
      // ✅ VERIFICAR QUE EL USUARIO TENGA ID
      if (response.user && response.user.id) {
        // ✅ GUARDAR USUARIO COMPLETO CON ID EN LOCALSTORAGE
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        console.log('✅ Usuario guardado después de login:', response.user); // Para debug
        
        setUser(response.user);
        setUserName(response.user.name);
        
        // ✅ DISPARAR EVENTO PARA ACTUALIZAR OTROS COMPONENTES
        window.dispatchEvent(new Event('userLoggedIn'));
      } else {
        console.error('❌ Usuario sin ID después del login:', response.user);
        throw new Error('Usuario no tiene ID válido');
      }
      
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      console.log('📝 Registrando usuario...'); // Para debug
      const response = await auth.register(name, email, password);
      
      // ✅ VERIFICAR QUE EL USUARIO TENGA ID
      if (response.user && response.user.id) {
        // ✅ GUARDAR USUARIO COMPLETO CON ID EN LOCALSTORAGE
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        console.log('✅ Usuario guardado después de registro:', response.user); // Para debug
        
        setUser(response.user);
        setUserName(response.user.name);
        
        // ✅ DISPARAR EVENTO PARA ACTUALIZAR OTROS COMPONENTES
        window.dispatchEvent(new Event('userRegistered'));
      } else {
        console.error('❌ Usuario sin ID después del registro:', response.user);
        throw new Error('Usuario no tiene ID válido');
      }
      
      return response;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const logout = () => {
    console.log('🚪 Cerrando sesión...'); // Para debug
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
    
    console.log('✅ Sesión cerrada y datos limpiados'); // Para debug
    
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
  };

  return (
    <UserContext.Provider
      value={{
        user,
        userName,
        setUser,
        login,
        register,
        logout,
        loading,
        isAuthenticated: auth.isAuthenticated(),
        getUserId, // ✅ NUEVA FUNCIÓN
        updateUserData // ✅ NUEVA FUNCIÓN
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