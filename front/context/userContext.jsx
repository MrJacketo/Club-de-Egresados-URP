import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { auth } from "../src/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null); // Firebase user object
  const [userName, setUserName] = useState(""); // User's name from backend or Firebase
  const [loading, setLoading] = useState(true); // Loading state for authentication

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // Fetch additional user data (e.g., name) from the backend
          const token = await currentUser.getIdToken();
          const response = await axios.get("http://localhost:8000/user-name", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserName(response.data.name); // Set the user's name
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserName(""); // Clear userName if no user is logged in
      }
      setLoading(false); // Authentication check is complete
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserName(""); // Clear userName on logout
  };

  return (
    <UserContext.Provider value={{ user, userName, setUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}