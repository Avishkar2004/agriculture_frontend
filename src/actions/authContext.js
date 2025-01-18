import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticatedUser, setAuthenticatedUser] = useState(() => {
    const storedUser = localStorage.getItem("authenticatedUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isTokenExpired = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp * 1000 < Date.now();
    } catch {
      return true; // Treat invalid token as expired
    }
  };

  const login = (user) => {
    try {
      if (!user?.token || typeof user.token !== "string") {
        throw new Error("Invalid or missing token");
      }
      const decodedToken = jwtDecode(user.token);
      const userInfo = {
        id: decodedToken.id,
        username: decodedToken.username,
        email: decodedToken.email,
        token: user.token,
        ...user,
        decodedToken,
        avatar: user.avatar || decodedToken.avatar,
      };
      // console.log("Email", decodedToken.email);
      setAuthenticatedUser(userInfo);
      localStorage.setItem("authenticatedUser", JSON.stringify(userInfo));
    } catch (error) {
      console.error("Error decoding token:", error);
      setAuthenticatedUser(null); // Ensure state remains consistent
    }
  };

  const logout = () => {
    setAuthenticatedUser(null);
    localStorage.removeItem("authenticatedUser");
    window.location.reload();
  };

  const getAuthToken = () =>
    authenticatedUser ? authenticatedUser.token : null;

  // Check token expiration when component mounts
  useEffect(() => {
    if (authenticatedUser && isTokenExpired(authenticatedUser.token)) {
      logout();
    }
  }, [authenticatedUser]);

  // Periodic check for token expiration
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (authenticatedUser && isTokenExpired(authenticatedUser.token)) {
        logout();
        window.location.reload();
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(checkInterval);
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
