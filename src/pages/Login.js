// src/pages/Login.js
import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { error } = await loginWithGoogle();
    if (error) {
      console.error("Chyba při přihlašování:", error.message);
      // Zde můžete zobrazit chybovou hlášku uživateli
    }
  };

  // Pokud je uživatel již přihlášen, přesměrujeme ho
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-xl text-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Přihlášení</h1>
      <p className="mb-8 text-gray-600">
        Pro přístup k interním sekcím se prosím přihlaste pomocí vašeho
        pracovního Google účtu.
      </p>
      <button
        onClick={handleLogin}
        className="w-full flex justify-center items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105"
      >
        <FaGoogle size={20} />
        <span>Přihlásit se přes Google</span>
      </button>
    </div>
  );
};

export default Login;
