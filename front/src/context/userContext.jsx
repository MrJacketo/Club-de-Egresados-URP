import { createContext, useState, useEffect, useContext } from "react";
import auth from "../auth";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(() => {
    return auth.getUser();
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
        
        // ✅ CORREGIDO: Usar el método seguro que nunca falla
        if (auth.isAuthenticated()) {
          const currentUser = await auth.getCurrentUserSafe();
          setUser(currentUser);
          setUserName(currentUser.name);
        } else {
          // Si no está autenticado, verificar si hay datos locales
          const localUser = auth.getUser();
          if (localUser) {
            setUser(localUser);
            setUserName(localUser.name);
          } else {
            setUser(null);
            setUserName("");
          }
        }
      } catch (error) {
        console.log("✅ Inicializando con datos locales después de error");
        const localUser = auth.getUser();
        if (localUser) {
          setUser(localUser);
          setUserName(localUser.name);
        } else {
          setUser(null);
          setUserName("");
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
