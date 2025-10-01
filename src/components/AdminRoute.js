// src/components/AdminRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="text-center p-10">Načítání...</div>;
  }

  if (!user || !isAdmin) {
    // Uživatel není admin, přesměrovat na domovskou stránku
    return <Navigate to="/" replace />;
  }

  // Uživatel je admin
  return children;
};

export default AdminRoute;
