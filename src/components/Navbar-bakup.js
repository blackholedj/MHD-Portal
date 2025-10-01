// src/components/Navbar.js
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaBus } from "react-icons/fa";

const Navbar = () => {
  const { user, isApproved } = useAuth();

  const linkClasses = "text-gray-600 hover:text-blue-600 transition duration-200";
  const activeLinkClasses = "text-blue-600 font-semibold";
  

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <NavLink
          to="/"
          className="text-2xl font-bold text-gray-800 flex items-center gap-2"
        >
          <FaBus className="text-blue-600" />
          MHD Portál
        </NavLink>
        <ul className="flex items-center space-x-6 text-lg">
          {/* Veřejné linky */}
          <li>
            <NavLink
              to="/" className={({ isActive }) => isActive ? activeLinkClasses : linkClasses}>
              Domů
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about" className={({ isActive }) => isActive ? activeLinkClasses : linkClasses}>
              O aplikaci
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact" className={({ isActive }) => isActive ? activeLinkClasses : linkClasses}>
              Kontakt
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/map" className={({ isActive }) => isActive ? activeLinkClasses : linkClasses}>
              Mapa
            </NavLink>
          </li>

          {/* Linky pro přihlášené a schválené */}
          {user && isApproved && (
            <>
              <li>
                <NavLink
                  to="/chat" className={({ isActive }) => isActive ? activeLinkClasses : linkClasses}>
                  Chat
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/documents" className={({ isActive }) => isActive ? activeLinkClasses : linkClasses}>
                  Dokumenty
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/courses" className={({ isActive }) => isActive ? activeLinkClasses : linkClasses}>
                  Kurzy
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
