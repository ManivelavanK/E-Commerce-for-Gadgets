import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    if (currentUser && token) {
      setUser(JSON.parse(currentUser));
    } else if (user) {
      const userData = JSON.parse(user);
      if (userData.token) {
        setUser(userData);
      }
    }
  }, []);

  const login = (userData) => {
    const user = userData.user || userData;
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("user", JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};