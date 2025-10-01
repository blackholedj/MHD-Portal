// src/pages/Home.js
import React from "react";
import { FaBus } from "react-icons/fa";
import { FaTrainTram } from "react-icons/fa6";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { user, profile } = useAuth();

  return (
    <div className="text-center p-6 sm:p-10 bg-white rounded-xl shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
      {/* Zde můžete vložit logo */}
      <div className="flex justify-center items-center gap-4 text-6xl text-blue-600 mb-6">
        <FaBus />
        <FaTrainTram />
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        {user
          ? `Vítejte zpět, ${profile?.full_name || "řidiči"}!`
          : "Vítejte v Portálu pro řidiče MHD"}
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
        Vaše centrální místo pro všechny potřebné informace, dokumenty, kurzy a
        komunikaci s kolegy.
      </p>
    </div>
  );
};

export default Home;
