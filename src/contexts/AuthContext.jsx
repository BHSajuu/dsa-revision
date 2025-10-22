"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const user = useQuery(
    api.users.getUserByEmail,
    email ? { email } : "skip"
  );

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
    setIsLoading(false);
  }, []);

  const login = (userEmail) => {
    setEmail(userEmail);
    localStorage.setItem("userEmail", userEmail);
  };

  const logout = () => {
    setEmail(null);
    localStorage.removeItem("userEmail");
  };

  const value = {
    email,
    user,
    isAuthenticated: !!email && !!user,
    login,
    logout,
    isLoading: isLoading || (email && user === undefined),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};