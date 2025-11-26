import { createContext, useState, useEffect, useContext } from "react";
import auth from "../auth";
import { getMembresiaRequest } from "../api/membresiaApi";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(() => {
    return auth.getUser();
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
        
        // ✅ CORREGIDO: Usar el método seguro que nunca falla
        if (auth.isAuthenticated()) {
          const currentUser = await auth.getCurrentUserSafe();
          setUser(currentUser);
          setUserName(currentUser.name);
          
          // Fetch membership status
          await fetchMembresia();
        } else {
          // Si no está autenticado, verificar si hay datos locales
          const localUser = auth.getUser();
          if (localUser) {
            setUser(localUser);
            setUserName(localUser.name);
            // Try to fetch membership even with local user
            await fetchMembresia();
          } else {
            setUser(null);
            setUserName("");
            setMembresia(null);
          }
        }
      } catch (error) {
        console.log("✅ Inicializando con datos locales después de error");
        const localUser = auth.getUser();
        if (localUser) {
          setUser(localUser);
          setUserName(localUser.name);
          // Try to fetch membership
          await fetchMembresia();
        } else {
          setUser(null);
          setUserName("");
          setMembresia(null);
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
      setUser(response.user);
      setUserName(response.user.name);
      
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
      setUser(response.user);
      setUserName(response.user.name);
      
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
