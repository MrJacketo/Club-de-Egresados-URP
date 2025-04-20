import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Retrieve user from localStorage on initialization
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [userName, setUserName] = useState(() => {
    // Retrieve userName from localStorage on initialization
    return localStorage.getItem("userName") || "";
  });
  const [loading, setLoading] = useState(true); // Loading state for authentication

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Fetch additional user data (e.g., name) from the backend
          const token = await currentUser.getIdToken();
          const response = await axios.get("http://localhost:8000/user-name", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const userName = response.data.name;

          // Update user and userName in state and localStorage
          setUser(currentUser);
          setUserName(userName);
          localStorage.setItem("user", JSON.stringify(currentUser));
          localStorage.setItem("userName", userName);
        } catch (error) {
          console.error("Error fetching user data:", error);
          logout(); // Clear user data if there's an error
        }
      } else {
        logout(); // Clear user data if no user is logged in
      }
      setLoading(false); // Authentication check is complete
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserName("");
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
  };

  return (
    <UserContext.Provider value={{ user, userName, setUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}