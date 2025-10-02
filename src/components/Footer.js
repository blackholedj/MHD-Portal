// src/components/Footer.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaSignInAlt, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import { supabase } from "../supabaseClient";

const Footer = () => {
  const { user, profile, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/"); // Přesměrování na domovskou stránku po odhlášení
  };

  return (
    <footer className="bg-gray-800 text-white shadow-inner">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          {/* Zobrazení linku na dashboard pouze pro adminy */}
          {isAdmin && (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 hover:text-blue-400 transition"
            >
              <FaTachometerAlt />
              <span>Dashboard</span>
            </Link>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm text-gray-300 hidden sm:block">
                {profile?.full_name || user.email}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-semibold transition"
              >
                <FaSignOutAlt />
                <span>Odhlásit</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold transition"
            >
              <FaSignInAlt />
              <span>Přihlásit</span>
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
