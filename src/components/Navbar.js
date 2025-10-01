import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaBus, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { user, isApproved } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // State pro mobilní menu

  const linkClasses =
    "text-gray-600 hover:text-blue-600 transition duration-200 py-2";
  const activeLinkClasses = "text-blue-600 font-semibold";

  // Funkce pro zavření menu po kliknutí na link (na mobilu)
  const closeMobileMenu = () => setIsOpen(false);

  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? activeLinkClasses : linkClasses
          }
          onClick={closeMobileMenu}
        >
          Domů
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? activeLinkClasses : linkClasses
          }
          onClick={closeMobileMenu}
        >
          O aplikaci
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive ? activeLinkClasses : linkClasses
          }
          onClick={closeMobileMenu}
        >
          Kontakt
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/map"
          className={({ isActive }) =>
            isActive ? activeLinkClasses : linkClasses
          }
          onClick={closeMobileMenu}
        >
          Mapa
        </NavLink>
      </li>

      {user && isApproved && (
        <>
          <li>
            <NavLink
              to="/chat"
              className={({ isActive }) =>
                isActive ? activeLinkClasses : linkClasses
              }
              onClick={closeMobileMenu}
            >
              Chat
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/documents"
              className={({ isActive }) =>
                isActive ? activeLinkClasses : linkClasses
              }
              onClick={closeMobileMenu}
            >
              Dokumenty
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/courses"
              className={({ isActive }) =>
                isActive ? activeLinkClasses : linkClasses
              }
              onClick={closeMobileMenu}
            >
              Kurzy
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <NavLink
            to="/"
            className="text-2xl font-bold text-gray-800 flex items-center gap-2"
          >
            <FaBus className="text-blue-600" />
            <span>MHD Portál</span>
          </NavLink>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-8 text-base">
            {navLinks}
          </ul>

          {/* Hamburger Ikonka */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Otevřít menu"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobilní Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <ul className="flex flex-col items-center space-y-4 text-lg">
              {navLinks}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
