import { createContext, useState, useEffect, useContext } from "react";
import auth from "../auth";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Retrieve user from localStorage on initialization
    return auth.getUser();
  });
  const [userName, setUserName] = useState(() => {
    // Retrieve userName from user data
    const userData = auth.getUser();
    return userData?.name || "";
  });
  const [loading, setLoading] = useState(true); // Loading state for authentication

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is authenticated
        if (auth.isAuthenticated()) {
          // Try to get current user data from server
          const currentUser = await auth.getCurrentUser();
          setUser(currentUser);
          setUserName(currentUser.name);
        } else {
          // No token found, user is not authenticated
          setUser(null);
          setUserName("");
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Token might be expired or invalid, clear auth data
       
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
    <UserContext.Provider value={{ 
      user, 
      userName, 
      setUser, 
      login, 
      register, 
      logout, 
      loading,
      isAuthenticated: auth.isAuthenticated()
    }}>
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