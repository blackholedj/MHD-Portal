// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, isApproved, loading } = useAuth();

  // Počkáme, dokud se nenačte stav autentizace
  if (loading) {
    return <div className="text-center p-10">Načítání...</div>;
  }

  if (!user) {
    // Uživatel není přihlášen, přesměrovat na login
    return <Navigate to="/login" replace />;
  }

  if (!isApproved) {
    // Uživatel je přihlášen, ale čeká na schválení
    return (
      <div className="text-center p-8 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md shadow-md max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Váš účet čeká na schválení</h1>
        <p>
          Děkujeme za registraci. Prosím, vyčkejte, než administrátor schválí
          váš přístup k interním sekcím.
        </p>
        <p>Tento proces může chvíli trvat.</p>
      </div>
    );
  }

  // Uživatel je přihlášen a schválen
  return children;
};

export default ProtectedRoute;
