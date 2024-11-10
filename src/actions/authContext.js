import React, { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticatedUser, setAuthenticatedUser] = useState(() => {
    const storedUser = localStorage.getItem("authenticatedUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (user) => {
    setAuthenticatedUser(user); // Directly set user with token in context
    localStorage.setItem("authenticatedUser", JSON.stringify(user)); // Store full user
  };

  // Function to handle user logout
  const logout = () => {
    setAuthenticatedUser(null);
    localStorage.removeItem("authenticatedUser");
  };

  const getAuthToken = () => {
    return authenticatedUser ? authenticatedUser.token : null;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("authenticatedUser");
    if (storedUser) {
      setAuthenticatedUser(JSON.parse(storedUser));
    }
  }, []);
  useEffect(() => {
  }, [authenticatedUser]);

  return (
    <AuthContext.Provider
      value={{ authenticatedUser, login, logout, getAuthToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
